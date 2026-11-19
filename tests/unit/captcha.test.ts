import { afterEach, describe, expect, it, vi } from 'vitest'
import { verifyCaptcha } from '@/lib/server/captcha'

const originalSecret = process.env.RECAPTCHA_SECRET_KEY

afterEach(() => {
    vi.unstubAllGlobals()
    if (originalSecret === undefined) delete process.env.RECAPTCHA_SECRET_KEY
    else process.env.RECAPTCHA_SECRET_KEY = originalSecret
})

function googleResponse(result: { success?: boolean }, ok = true) {
    return { ok, json: async () => result }
}

describe('verificación de captcha', () => {
    it('envía el secreto, el token y la IP a Google', async () => {
        process.env.RECAPTCHA_SECRET_KEY = 'secret'
        const fetchMock = vi.fn(async () => googleResponse({ success: true }))
        vi.stubGlobal('fetch', fetchMock)

        await expect(verifyCaptcha('token', '1.2.3.4')).resolves.toBe(true)

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
        expect(url).toBe('https://www.google.com/recaptcha/api/siteverify')
        const body = new URLSearchParams(init.body as string)
        expect(body.get('secret')).toBe('secret')
        expect(body.get('response')).toBe('token')
        expect(body.get('remoteip')).toBe('1.2.3.4')
    })

    it('omite la IP cuando no está disponible', async () => {
        process.env.RECAPTCHA_SECRET_KEY = 'secret'
        const fetchMock = vi.fn(async () => googleResponse({ success: true }))
        vi.stubGlobal('fetch', fetchMock)

        await expect(verifyCaptcha('token')).resolves.toBe(true)

        const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
        expect(new URLSearchParams(init.body as string).has('remoteip')).toBe(false)
    })

    it('rechaza tokens ausentes o inválidos sin consultar a Google', async () => {
        process.env.RECAPTCHA_SECRET_KEY = 'secret'
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)

        await expect(verifyCaptcha(undefined)).resolves.toBe(false)
        await expect(verifyCaptcha('')).resolves.toBe(false)
        await expect(verifyCaptcha(123)).resolves.toBe(false)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rechaza la solicitud cuando falta el secreto', async () => {
        delete process.env.RECAPTCHA_SECRET_KEY
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)

        await expect(verifyCaptcha('token')).resolves.toBe(false)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rechaza cuando Google responde con error o sin éxito', async () => {
        process.env.RECAPTCHA_SECRET_KEY = 'secret'
        vi.stubGlobal('fetch', vi.fn(async () => googleResponse({ success: false })))
        await expect(verifyCaptcha('token')).resolves.toBe(false)

        vi.stubGlobal('fetch', vi.fn(async () => googleResponse({}, false)))
        await expect(verifyCaptcha('token')).resolves.toBe(false)
    })

    it('rechaza cuando no se puede conectar con Google', async () => {
        process.env.RECAPTCHA_SECRET_KEY = 'secret'
        vi.stubGlobal('fetch', vi.fn(async () => {
            throw new Error('network')
        }))

        await expect(verifyCaptcha('token')).resolves.toBe(false)
    })
})
