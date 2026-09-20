import type { ApiResult } from '@/types/api'
import { backendRequest } from './backend'

type PublicEndpoint = 'productos' | 'sistema' | 'ubigeos'

export function integrationPublicPath(endpoint: PublicEndpoint, qry?: unknown) {
    const search = new URLSearchParams()
    if (endpoint === 'sistema') {
        const keys = Array.isArray(qry) ? qry.filter((key): key is string => typeof key === 'string') : []
        search.set('keys', keys.join(','))
        return `ubigeo-data?${search}`
    }
    const filters = qry && typeof qry === 'object' && 'fltr' in qry
        ? (qry as { fltr?: Record<string, { op?: string; val?: unknown }> }).fltr || {}
        : {}
    if (endpoint === 'productos') {
        const ids = filters.id?.val
        if (Array.isArray(ids)) search.set('ids', ids.map(String).join(','))
        else if (ids) search.set('ids', String(ids))
        if (filters.linea?.val) search.set('linea', String(filters.linea.val))
        if (filters.categoria?.val) search.set('categoria', String(filters.categoria.val))
        return `catalog/products${search.size ? `?${search}` : ''}`
    }
    for (const key of ['departamento', 'provincia', 'distrito']) {
        const filter = filters[key]
        const value = filter?.val
        if (value) search.set(key, String(value))
    }
    if (filters.distrito?.op === 'Contiene' && filters.distrito.val) {
        search.delete('distrito')
        search.set('search', String(filters.distrito.val))
    }
    return `locations/ubigeos${search.size ? `?${search}` : ''}`
}

export async function serverGet<T = any>(endpoint: PublicEndpoint, params: { qry?: unknown } = {}): Promise<ApiResult<T>> {
    const result = await backendRequest<T>(integrationPublicPath(endpoint, params.qry))
    const { headers, ...response } = result
    return {
        ...response,
        retry_after: headers.get('retry-after'),
        rate_limit_reset: headers.get('ratelimit-reset'),
    }
}
