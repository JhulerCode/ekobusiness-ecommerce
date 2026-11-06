import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const TRACKED_OPERATIONS = [
    ['/productos', 'get', '200'],
    ['/productos/{id}', 'get', '200'],
    ['/ubigeo-data', 'get', '200'],
    ['/locations/ubigeos', 'get', '200'],
    ['/customers/me', 'get', '200'],
    ['/orders', 'get', '200'],
    ['/orders', 'post', '201'],
    ['/orders/{id}', 'get', '200'],
    ['/payments/izipay/form-token', 'post', '201'],
]

export const TRACKED_SCHEMAS = [
    'OrderCreateRequest',
    'OrderDetail',
    'OrderCreatedEnvelope',
    'Product',
    'Ubigeo',
    'Catalogs',
    'CheckoutFormTokenRequest',
    'OrderLookupRequest',
]

function resolveSchema(spec, ref, seen = new Set()) {
    if (!ref || !ref.startsWith('#/')) return null
    if (seen.has(ref)) return null
    seen.add(ref)
    const node = ref.slice(2).split('/').reduce((acc, key) => acc?.[key], spec)
    if (!node) return null
    if (node.$ref && node.$ref !== ref) return resolveSchema(spec, node.$ref, seen)
    if (node.content?.['application/json']?.schema?.$ref) {
        return resolveSchema(spec, node.content['application/json'].schema.$ref, seen)
    }
    return node
}

function responseRef(operation) {
    const responses = operation?.responses || {}
    const status = Object.keys(responses).find((code) => /^[23]/.test(code))
    const response = responses[status]
    return response?.$ref || response?.content?.['application/json']?.schema?.$ref || null
}

function requestRef(operation) {
    return operation?.requestBody?.content?.['application/json']?.schema?.$ref || null
}

function diffSchema(before, after, path, findings) {
    if (!before || !after) return
    for (const field of after.required || []) {
        if (!Array.isArray(before.required) || !before.required.includes(field)) {
            findings.push(`${path}: campo requerido añadido '${field}'`)
        }
    }
    const beforeProps = before.properties || {}
    const afterProps = after.properties || {}
    for (const key of Object.keys(beforeProps)) {
        if (!afterProps[key]) findings.push(`${path}: propiedad eliminada '${key}'`)
    }
    for (const key of Object.keys(afterProps)) {
        const prev = beforeProps[key]
        const next = afterProps[key]
        if (!prev) continue
        const child = `${path}.${key}`
        if (prev.type && next.type && prev.type !== next.type) {
            findings.push(`${child}: type '${prev.type}' -> '${next.type}'`)
        }
        if (prev.const !== undefined && prev.const !== next.const) {
            findings.push(`${child}: const '${prev.const}' -> '${next.const}'`)
        }
        if (Array.isArray(prev.enum) && Array.isArray(next.enum)) {
            const removed = prev.enum.filter((value) => !next.enum.includes(value))
            if (removed.length) findings.push(`${child}: enum pierde ${JSON.stringify(removed)}`)
        }
        if (prev.pattern && prev.pattern !== next.pattern) {
            findings.push(`${child}: pattern '${prev.pattern}' -> '${next.pattern}'`)
        }
        if (prev.items && next.items) diffSchema(prev.items, next.items, `${child}[]`, findings)
        if (prev.properties && next.properties) diffSchema(prev, next, child, findings)
    }
}

export function diffContracts(before, after) {
    const findings = []
    for (const [path, method, status] of TRACKED_OPERATIONS) {
        const prevOp = before.paths?.[path]?.[method]
        const nextOp = after.paths?.[path]?.[method]
        if (!prevOp) continue
        if (!nextOp) {
            findings.push(`${method.toUpperCase()} ${path}: operación eliminada`)
            continue
        }
        if (!nextOp.responses?.[status]) findings.push(`${method.toUpperCase()} ${path}: respuesta ${status} eliminada`)
        const prevRes = responseRef(prevOp)
        const nextRes = responseRef(nextOp)
        if (prevRes && prevRes !== nextRes) {
            findings.push(`${method.toUpperCase()} ${path}: response schema '${prevRes}' -> '${nextRes || '?'}'`)
        }
        const prevReq = requestRef(prevOp)
        const nextReq = requestRef(nextOp)
        if (prevReq && prevReq !== nextReq) {
            findings.push(`${method.toUpperCase()} ${path}: request schema '${prevReq}' -> '${nextReq || '?'}'`)
        }
    }
    for (const name of TRACKED_SCHEMAS) {
        const prev = resolveSchema(before, `#/components/schemas/${name}`)
        const next = resolveSchema(after, `#/components/schemas/${name}`)
        if (prev && !next) findings.push(`schema '${name}' eliminado`)
        else diffSchema(prev, next, `schema '${name}'`, findings)
    }
    return findings
}

async function loadSpec(source) {
    if (/^https?:\/\//.test(source)) {
        const response = await fetch(source)
        if (!response.ok) throw new Error(`HTTP ${response.status} al descargar ${source}`)
        return response.json()
    }
    return JSON.parse(await readFile(resolve(root, source), 'utf8'))
}

async function main() {
    const args = process.argv.slice(2)
    const flag = (name, fallback) => {
        const index = args.indexOf(name)
        return index === -1 ? fallback : args[index + 1]
    }
    const base = process.env.API_URL?.replace(/\/$/, '') || ''
    const source = flag('--source', base ? `${base}/api/integration/v1/openapi.json` : '../../backend/src/integration/openapi.json')
    const snapshotPath = resolve(root, flag('--snapshot', 'contracts/integration-openapi.snapshot.json'))
    if (!source) throw new Error('Indica --source <url|ruta> o define API_URL')
    const current = await loadSpec(source)
    if (args.includes('--update')) {
        await mkdir(dirname(snapshotPath), { recursive: true })
        await writeFile(snapshotPath, `${JSON.stringify(current, null, 2)}\n`)
        console.log(`snapshot actualizado: ${snapshotPath} (v${current.info?.version || '?'})`)
        return
    }
    const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'))
    const findings = diffContracts(snapshot, current)
    if (!findings.length) {
        console.log(`contrato sin breaking: snapshot v${snapshot.info?.version} -> v${current.info?.version}`)
        return
    }
    console.error(`cambios breaking en integration (${findings.length}):`)
    for (const finding of findings) console.error(`- ${finding}`)
    process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error.message)
        process.exitCode = 1
    })
}
