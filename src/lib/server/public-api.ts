import type { ApiResult } from '@/types/api'
import { backendRequest } from './backend'

type PublicEndpoint = 'productos' | 'sistema' | 'ubigeos'

type PublicParams = {
    ids?: string | string[]
    linea?: string
    categoria?: string
    featured?: string
    keys?: string | string[]
    id?: string
    departamento?: string
    provincia?: string
    distrito?: string
    search?: string
}

function setParam(search: URLSearchParams, key: string, value: unknown) {
    if (value === undefined || value === null || value === '') return
    search.set(key, Array.isArray(value) ? value.map(String).join(',') : String(value))
}

export function integrationPublicPath(endpoint: PublicEndpoint, params: PublicParams = {}) {
    const search = new URLSearchParams()
    if (endpoint === 'sistema') {
        search.set('keys', Array.isArray(params.keys) ? params.keys.join(',') : String(params.keys ?? ''))
        return `ubigeo-data?${search}`
    }
    if (endpoint === 'productos') {
        setParam(search, 'ids', params.ids)
        setParam(search, 'linea', params.linea)
        setParam(search, 'categoria', params.categoria)
        setParam(search, 'featured', params.featured)
        return `productos${search.size ? `?${search}` : ''}`
    }
    for (const key of ['id', 'departamento', 'provincia', 'distrito', 'search'] as const) {
        setParam(search, key, params[key])
    }
    return `locations/ubigeos${search.size ? `?${search}` : ''}`
}

export async function serverGet<T = any>(endpoint: PublicEndpoint, params: PublicParams = {}): Promise<ApiResult<T>> {
    const result = await backendRequest<T>(integrationPublicPath(endpoint, params))
    const { headers, ...response } = result
    return {
        ...response,
        retry_after: headers.get('retry-after'),
        rate_limit_reset: headers.get('ratelimit-reset'),
    }
}
