export interface ApiMeta {
    [key: string]: unknown
}

export interface ApiWarning {
    type: string
    title: string
    detail?: string
}

export interface ApiProblem {
    type: string
    title: string
    status: number
    detail: string
    instance?: string
    errorCode?: string
    errors?: Array<{ detail: string; pointer?: string }>
}

interface ApiTransportMetadata {
    retry_after?: string | null
    rate_limit_reset?: string | null
}

export type ApiResult<T = unknown> =
    | (ApiTransportMetadata & {
          ok: true
          status: number
          data?: T
          meta?: ApiMeta
          warnings?: ApiWarning[]
      })
    | (ApiTransportMetadata & {
          ok: false
          status: number
          problem: ApiProblem
      })

export type JsonRecord = Record<string, any>

export interface Product extends JsonRecord {
    id: string | number
    name: string
    price: string | number
    club_price?: string | number | null
    previous_price?: string | number | null
    photos?: Array<{ url?: string }>
    photo?: string
    slug?: string | number
    ecommerce_data?: JsonRecord
}

export interface AuthUser extends JsonRecord {
    id: string
    correo?: string
}

export interface OrderAccess {
    id: string
    redirect_url: string
}
