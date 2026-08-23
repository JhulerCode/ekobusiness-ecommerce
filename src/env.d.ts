/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly API_URL: string
    readonly ERP_API_KEY: string
    readonly PUBLIC_IZIPAY_PUBLIC_KEY: string
    readonly PUBLIC_RECAPTCHA_SITE_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
