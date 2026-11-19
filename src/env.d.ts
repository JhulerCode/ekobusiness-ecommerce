/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly API_URL: string
    readonly ERP_API_KEY: string
    readonly ERP_GUEST_PARTNER_ID: string
    readonly PAYMENT_PROVIDER: string
    readonly PUBLIC_IZIPAY_PUBLIC_KEY: string
    readonly PUBLIC_RECAPTCHA_SITE_KEY: string
    readonly RECAPTCHA_SECRET_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare global {
    interface Window {
        grecaptcha?: {
            render(
                container: Element,
                options: {
                    sitekey: string
                    callback?: (token: string) => void
                    'expired-callback'?: () => void
                },
            ): number
            getResponse(widgetId?: number): string
            reset(widgetId?: number): void
            ready(callback: () => void): void
        }
    }
}

declare namespace App {
    interface Locals {
        session?: import('@/lib/server/backend').SessionState
    }
}
