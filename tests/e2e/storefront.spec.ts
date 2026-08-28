import { test, expect } from '@playwright/test'

test('renderiza el catálogo mediante Astro SSR', async ({ page }) => {
    await page.goto('/tienda')
    await expect(page).toHaveTitle(/Tienda.*SUNKA/i)
    await expect(page.getByRole('heading', { name: /Tienda/i }).first()).toBeVisible()
})

test('muestra 404 cuando el producto no existe', async ({ page }) => {
    await page.goto('/productos/no-existe')
    await expect(page).toHaveTitle(/no encontrada|404/i)
})

test('envía newsletter por el BFF del mismo origen', async ({ page }) => {
    await page.goto('/')
    const response = await page.evaluate(async () => {
        const result = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ correo: 'cliente@example.com' }),
        })
        return { status: result.status, body: await result.json() }
    })
    expect(response).toEqual({ status: 201, body: { data: { id: 'newsletter-1' } } })
})

test('mantiene la sesión en cookies HttpOnly y no expone el token', async ({ page }) => {
    await page.goto('/')
    const auth = await page.evaluate(async () => {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ correo: 'cliente@example.com', contrasena: 'secreto123' }),
        })
        return response.json()
    })
    expect(auth.token).toBeUndefined()
    expect(await page.evaluate(() => document.cookie)).not.toContain('sunka_access')

    const session = await page.request.get('/api/account/session')
    expect(session.status()).toBe(200)
    expect(await session.json()).toMatchObject({ data: { id: 'user-1' } })

    const logoutStatus = await page.evaluate(async () => {
        const response = await fetch('/api/auth/logout', { method: 'POST' })
        return response.status
    })
    expect(logoutStatus).toBe(204)
    expect((await page.request.get('/api/account/session')).status()).toBe(401)
})

test('publica las promociones y sus condiciones desde el mismo catálogo', async ({ page }) => {
    await page.goto('/promociones')
    await expect(page).toHaveTitle(/Promociones.*SUNKA/i)
    await expect(page.getByRole('heading', { name: 'Promociones generales' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Promociones Club' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Luxury Moment' })).toBeVisible()
    await expect(page.getByText('Caja sorpresa').first()).toBeVisible()
})

test('renderiza la cuenta autenticada desde el servidor sin mostrar el estado de invitado', async ({ page }) => {
    await page.goto('/')
    const response = await page.request.post('/api/auth/signin', {
        data: { correo: 'cliente@example.com', contrasena: 'secreto123' },
    })
    expect(response.status()).toBe(200)

    await page.goto('/account')
    await expect(page.getByRole('heading', { name: 'Hola, cliente' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'No has iniciado sesión' })).toHaveCount(0)
})

test('renueva una sesión vencida una sola vez', async ({ context, page }) => {
    await context.addCookies([
        { name: 'sunka_access', value: 'expired', url: 'http://127.0.0.1:4322', httpOnly: true },
        {
            name: 'sunka_refresh',
            value: 'refresh-mock',
            url: 'http://127.0.0.1:4322',
            httpOnly: true,
        },
    ])
    await page.goto('/')
    const session = await page.request.get('/api/account/session')
    expect(session.status()).toBe(200)
    expect(await session.json()).toMatchObject({ data: { id: 'user-1' } })
})

test('abre un pedido sin incluir access_token en la URL', async ({ page }) => {
    await page.goto('/')
    const lookup = await page.evaluate(async () => {
        const response = await fetch('/api/pedidos/consulta', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ codigo: 'SUNKA-1', codigo_consulta: '123456' }),
        })
        return response.json()
    })
    expect(lookup.data.access_token).toBeUndefined()
    expect(lookup.data.redirect_url).toBe('/pedidos/order-1')

    await page.goto(lookup.data.redirect_url)
    expect(page.url()).not.toContain('access_token')
    await expect(page.getByText('#SUNKA-1')).toBeVisible()
    await expect(page.getByText('Promociones', { exact: true })).toBeVisible()
    await expect(page.getByText('Envío gratis desde S/ 75')).toBeVisible()
    await expect(page.getByText('Caja sorpresa')).toBeVisible()
})

test('espera la confirmación IPN antes de completar un checkout intent', async ({ page }) => {
    await page.goto('/')
    const result = await page.evaluate(async () => {
        const created = await fetch('/api/izipay/create-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                correo: 'cliente@example.com',
                paymentMethodToken: 'nueva',
                socio_pedido: {
                    codigo: 'draft',
                    monto: 10,
                    socio_datos: {},
                    entrega_tipo: 'retiro',
                    punto_retiro: 'oficina-ekobusiness',
                    fecha_entrega: '2099-01-01',
                    socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
                },
            }),
        }).then((response) => response.json())
        const validated = await fetch('/api/izipay/validate-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ paymentData: {}, checkout_intent_id: created.data.checkout_intent_id }),
        }).then((response) => response.json())
        const confirmed = await fetch(`/api/izipay/intents/${created.data.checkout_intent_id}`)
            .then((response) => response.json())
        return { created, validated, confirmed, cookies: document.cookie }
    })

    expect(result.created.data.formToken).toBe('form-token')
    expect(result.created.data.checkout_access_token).toBeUndefined()
    expect(result.created.data.order_access_token).toBeUndefined()
    expect(result.created.data.redirect_url).toBe('/pedidos/payment-order-id-1')
    expect(result.validated.data.status).toBe('processing')
    expect(result.validated.data.redirect_url).toBeUndefined()
    expect(result.confirmed.data.status).toBe('completed')
    expect(result.confirmed.data.redirect_url).toBe('/pedidos/payment-order-1')
    expect(JSON.stringify(result)).not.toContain('payment-access')
    expect(JSON.stringify(result)).not.toContain('itd_')
    expect(result.cookies).not.toContain('sunka_checkout_')
})

test('recupera un pago desde la cookie del intento sin repetir el cobro', async ({ page }) => {
    await page.goto('/')
    const result = await page.evaluate(async () => {
        const created = await fetch('/api/izipay/create-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                correo: 'cliente@example.com', paymentMethodToken: 'nueva',
                socio_pedido: {
                    socio_datos: {},
                    entrega_tipo: 'retiro',
                    punto_retiro: 'oficina-ekobusiness',
                    fecha_entrega: '2099-01-01',
                    socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
                },
            }),
        }).then((response) => response.json())
        const recovered = await fetch(`/api/izipay/intents/${created.data.checkout_intent_id}`)
            .then((response) => response.json())
        return { created, recovered }
    })

    expect(result.recovered.data.status).toBe('completed')
    expect(result.recovered.data.redirect_url).toBe('/pedidos/payment-order-1')
    expect(JSON.stringify(result)).not.toContain('checkout-access')
    expect(JSON.stringify(result)).not.toContain('payment-access')
})
