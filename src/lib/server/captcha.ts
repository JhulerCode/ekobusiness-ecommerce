import { runtimeEnv } from './backend'

const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'

export async function verifyCaptcha(token: unknown, remoteIp?: string) {
    const secret = runtimeEnv('RECAPTCHA_SECRET_KEY')
    if (!secret || typeof token !== 'string' || !token) return false

    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    try {
        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body,
        })
        if (!response.ok) {
            console.error(`[captcha] Google respondió ${response.status}`)
            return false
        }
        const result = (await response.json()) as { success?: boolean }
        return result.success === true
    } catch (error) {
        console.error(
            '[captcha] no se pudo verificar el token:',
            error instanceof Error ? error.message : error,
        )
        return false
    }
}
