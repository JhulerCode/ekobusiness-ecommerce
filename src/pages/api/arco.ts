import type { APIRoute } from 'astro'
import { allowedUploadTypes, arcoMetadataSchema, maxUploadBytes } from '@/lib/api-schemas'
import { backendRequest, getClientIp } from '@/lib/server/backend'
import { assertSameOrigin, forbiddenOrigin, invalidRequest, json } from '@/lib/server/bff'

const fileFields = new Set(['doc_file', 'rep_doc_file', 'extras_doc', 'archivo', 'archivos'])

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    let incoming: FormData
    try {
        incoming = await context.request.formData()
    } catch {
        return invalidRequest()
    }

    const rawMetadata = incoming.get('datos')
    let metadata: unknown
    try {
        metadata = typeof rawMetadata === 'string' ? JSON.parse(rawMetadata) : undefined
    } catch {
        return invalidRequest()
    }
    if (!arcoMetadataSchema.safeParse(metadata).success) return invalidRequest()

    const outgoing = new FormData()
    outgoing.set('datos', JSON.stringify(metadata))
    let fileCount = 0
    for (const [name, value] of incoming.entries()) {
        if (name === 'datos') continue
        if (!(value instanceof File) || !fileFields.has(name)) return invalidRequest()
        if (!allowedUploadTypes.has(value.type) || value.size > maxUploadBytes || ++fileCount > 3) {
            return invalidRequest()
        }
        outgoing.append(name, value, value.name)
    }

    return json(
        await backendRequest('forms/arco', {
            method: 'POST',
            body: outgoing,
            clientIp: getClientIp(context.request),
        }),
    )
}
