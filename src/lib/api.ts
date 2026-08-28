import type { ApiProblem, ApiResult, Product } from '@/types/api'

export const urls = {
    account: '/api/account',
    auth: '/api/auth',
    productos: '/api/productos',
    arco: '/api/arco',
    izipay: '/api/izipay',
    libro_reclamos: '/api/libro-reclamos',
    socio_pedidos: '/api/pedidos',
    newsletter: '/api/newsletter',
    sistema: '/api/sistema',
    ubigeos: '/api/ubigeos',
} as const

type Endpoint = keyof typeof urls | string
type RequestItem = Record<string, any> & {
    id?: string | number
    is_form_data?: boolean
    formData?: boolean
}

function endpointUrl(endpoint: Endpoint) {
    return endpoint.startsWith('/') ? endpoint : urls[endpoint as keyof typeof urls]
}

function setFormData(item: RequestItem) {
    const formData = new FormData()
    const { archivo, archivos, is_form_data: _isFormData, formData: _formData, ...rest } = item

    for (const [key, value] of Object.entries(rest)) {
        if (value instanceof File) formData.append(key, value)
        else if (Array.isArray(value) && value.every((entry) => entry instanceof File)) {
            value.forEach((entry) => formData.append(key, entry))
        }
    }
    if (archivo instanceof File) formData.append('archivo', archivo)
    if (Array.isArray(archivos)) {
        archivos.filter((entry) => entry instanceof File).forEach((entry) => formData.append('archivos', entry))
    }

    const metadata = Object.fromEntries(
        Object.entries(rest).filter(
            ([, value]) => !(value instanceof File) && !(Array.isArray(value) && value.every((entry) => entry instanceof File)),
        ),
    )
    formData.append('datos', JSON.stringify(metadata))
    return formData
}

function fallbackProblem(status: number, slug: string, detail: string): ApiProblem {
    return {
        type: `urn:itd:ecommerce:problem:${slug}`,
        title: status >= 500 ? 'Servicio no disponible' : 'Solicitud no completada',
        status,
        detail,
    }
}

async function request<T>(url: string, init: RequestInit): Promise<ApiResult<T>> {
    try {
        const response = await fetch(url, { ...init, credentials: 'same-origin' })
        const transport = {
            status: response.status,
            retry_after: response.headers.get('retry-after'),
            rate_limit_reset: response.headers.get('ratelimit-reset'),
        }
        if (response.status === 204) return { ok: true, ...transport }
        const parsed = await response.json() as Record<string, unknown>
        if (!response.ok) {
            const problem = parsed && typeof parsed.type === 'string' &&
                typeof parsed.title === 'string' && typeof parsed.detail === 'string'
                ? parsed as unknown as ApiProblem
                : fallbackProblem(response.status, 'invalid-error-response', 'No se pudo completar la solicitud.')
            return { ok: false, ...transport, problem: { ...problem, status: response.status } }
        }
        return {
            ok: true,
            ...transport,
            data: parsed.data as T,
            ...(parsed.meta && typeof parsed.meta === 'object'
                ? { meta: parsed.meta as Record<string, unknown> }
                : {}),
            ...(Array.isArray(parsed.warnings) ? { warnings: parsed.warnings } : {}),
        }
    } catch {
        return {
            ok: false,
            status: 503,
            problem: fallbackProblem(503, 'network-unavailable', 'No se pudo conectar con el servicio.'),
        }
    }
}

export async function get<T = any>(endpoint: Endpoint, params: { qry?: unknown } | null = {}) {
    const url = new URL(endpointUrl(endpoint), window.location.origin)
    if (params?.qry !== undefined) url.searchParams.set('qry', JSON.stringify(params.qry))
    return request<T>(url.toString(), { method: 'GET' })
}

export async function post<T = any>(endpoint: Endpoint, item: RequestItem, _message?: unknown, _legacyToken?: unknown) {
    const isFormData = item.is_form_data === true
    return request<T>(endpointUrl(endpoint), {
        method: 'POST',
        headers: isFormData ? undefined : { 'content-type': 'application/json' },
        body: isFormData ? setFormData(item) : JSON.stringify(item),
    })
}

export async function patch<T = any>(endpoint: Endpoint, item: RequestItem, _message?: unknown) {
    const url = item.id === undefined ? endpointUrl(endpoint) : `${endpointUrl(endpoint)}/${item.id}`
    const isFormData = item.formData === true || item.is_form_data === true
    return request<T>(url, {
        method: 'PATCH',
        headers: isFormData ? undefined : { 'content-type': 'application/json' },
        body: isFormData ? setFormData(item) : JSON.stringify(item),
    })
}

export async function delet<T = any>(endpoint: Endpoint, item: RequestItem, _message?: unknown) {
    const url = item.id === undefined ? endpointUrl(endpoint) : `${endpointUrl(endpoint)}/${item.id}`
    return request<T>(url, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item),
    })
}

export function formatProductos(datos: Product[] = []): Product[] {
    return datos.map((source): Product => {
        const ecommerceData = (source.ecommerce_data || {}) as Record<string, any>
        const fotos = Array.isArray(ecommerceData.fotos)
            ? ecommerceData.fotos
            : Array.isArray(source.fotos)
              ? source.fotos
              : []
        const producto = {
            ...source,
            ...ecommerceData,
            nombre: ecommerceData.name ?? source.nombre,
            fotos,
        }

        return {
            ...producto,
            precio:
                producto.precio == null || producto.precio === ''
                    ? producto.precio
                    : Number(producto.precio).toFixed(2),
            precio_club:
                producto.precio_club == null || producto.precio_club === ''
                    ? producto.precio_club
                    : Number(producto.precio_club).toFixed(2),
            precio_anterior:
                producto.precio_anterior == null || producto.precio_anterior === ''
                    ? null
                    : Number(producto.precio_anterior).toFixed(2),
            foto: producto.fotos[0]?.url,
            slug: producto.id,
        } as Product
    })
}
