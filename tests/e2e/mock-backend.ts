import { createServer } from 'node:http'

const systemData = {
    documentos_identidad: [],
    entrega_tipos: [],
    pago_metodos: [],
    comprobante_tipos: [],
    socio_pedidos_etapas: [],
}

createServer((request, response) => {
    if (request.headers['x-api-key'] !== 'itd_0000000000000000.e2e-integration-secret-00000000000000000000') {
        response.writeHead(401, { 'content-type': 'application/problem+json' })
        response.end(JSON.stringify({
            type: 'urn:itderp:problem:integration-invalid-api-key',
            title: 'API key inválida',
            status: 401,
            detail: 'La credencial de integración no es válida.',
            instance: '/api/integration/v1/e2e',
            errorCode: 'INTEGRATION_INVALID_API_KEY',
        }))
        return
    }

    const url = new URL(request.url || '/', 'http://127.0.0.1:4011')
    response.setHeader('content-type', 'application/json')
    if (url.pathname === '/api/integration/v1/productos') {
        const ids = (url.searchParams.get('ids') || '').split(',').filter(Boolean)
        const product = {
            id: 'product-1',
            nombre: 'Producto de prueba',
            unidad: 'UND',
            igv_afectacion: '10',
            list_price: 10,
            linea1: { nombre: 'Tradicional' },
            ecommerce_data: {
                precio: 10,
                presentacion: [{ label: 'Saquitos', value: 20 }],
                fotos: [],
            },
        }
        const data = !ids.length || ids.includes('product-1') ? [product] : []
        response.end(JSON.stringify({ data }))
    } else if (url.pathname === '/api/integration/v1/ubigeo-data') {
        response.end(JSON.stringify({ data: systemData }))
    } else if (url.pathname === '/api/integration/v1/forms/newsletter') {
        response.writeHead(201)
        response.end(JSON.stringify({ data: { id: 'newsletter-1' } }))
    } else if (url.pathname === '/api/integration/v1/customers/auth/signin') {
        response.end(
            JSON.stringify({
                data: {
                    user: { id: 'user-1', correo: 'cliente@example.com', activo: true },
                    access_token: 'access-mock',
                    refresh_token: 'refresh-mock',
                },
            }),
        )
    } else if (url.pathname === '/api/integration/v1/customers/auth/refresh') {
        const authenticated = true
        response.writeHead(200)
        response.end(
            JSON.stringify(
                authenticated
                    ? { data: { access_token: 'access-mock' } }
                    : {
                          type: 'urn:itderp:problem:integration-customer-invalid-session',
                          title: 'Sesión inválida',
                          status: 401,
                          detail: 'La sesión no es válida o ha vencido.',
                          instance: '/api/integration/v1/customers/auth/refresh',
                          errorCode: 'INTEGRATION_CUSTOMER_INVALID_SESSION',
                      },
            ),
        )
    } else if (url.pathname === '/api/integration/v1/customers/auth/logout') {
        response.writeHead(204)
        response.end()
    } else if (url.pathname === '/api/integration/v1/customers/me') {
        const authenticated = request.headers.authorization === 'Bearer access-mock'
        response.writeHead(authenticated ? 200 : 401)
        response.end(
            JSON.stringify(
                authenticated
                    ? { data: { id: 'user-1', correo: 'cliente@example.com' } }
                    : {
                          type: 'urn:itderp:problem:integration-customer-invalid-session',
                          title: 'Sesión inválida',
                          status: 401,
                          detail: 'La sesión no es válida o ha vencido.',
                          instance: '/api/integration/v1/customers/me',
                          errorCode: 'INTEGRATION_CUSTOMER_INVALID_SESSION',
                      },
            ),
        )
    } else if (url.pathname === '/api/integration/v1/orders/lookup') {
        response.end(
            JSON.stringify({ data: { id: 'order-1', access_token: 'order-token' } }),
        )
    } else if (url.pathname === '/api/integration/v1/orders/order-1') {
        const authorized = request.headers['x-order-access'] === 'order-token'
        response.writeHead(authorized ? 200 : 401)
        response.end(
            JSON.stringify(
                authorized
                    ? {
                          data: {
                              codigo: 'SUNKA-1',
                              fecha: '2026-08-22',
                              monto: 25,
                              estado1: { nombre: 'RECIBIDO' },
                              moneda1: { simbolo: 'S/ ' },
                              socio_datos: {},
                              entrega_tipo1: {},
                              comprobante_tipo1: {},
                              pago_metodo1: {},
                              socio_pedido_items: [],
                              promociones: [
                                  {
                                      key: 'free-shipping-general',
                                      name: 'Envío gratis desde S/ 75',
                                      benefits: [
                                          { type: 'envio_gratis', label: 'Envío gratis' },
                                          {
                                              type: 'caja_sorpresa',
                                              label: 'Caja sorpresa',
                                              quantity: 1,
                                          },
                                      ],
                                  },
                              ],
                              etapas: [],
                          },
                      }
                    : {
                          type: 'urn:itderp:problem:integration-order-access-invalid',
                          title: 'Acceso al pedido inválido',
                          status: 401,
                          detail: 'El acceso al pedido no es válido o ha vencido.',
                          instance: '/api/integration/v1/orders/order-1',
                          errorCode: 'INTEGRATION_ORDER_ACCESS_INVALID',
                      },
            ),
        )
    } else if (url.pathname === '/api/integration/v1/payments/izipay/form-token') {
        response.writeHead(201)
        response.end(JSON.stringify({
            data: {
                formToken: 'form-token', checkout_intent_id: 'intent-1',
                checkout_access_token: 'checkout-access', orderId: 'payment-order-1',
                lookup_code: '123456',
                order_id: 'payment-order-id-1', order_access_token: 'pending-order-access',
                amount: 1000, currency: 'PEN', expires_at: '2026-08-23T00:00:00.000Z',
            },
        }))
    } else if (url.pathname === '/api/integration/v1/payments/izipay/validate') {
        response.writeHead(202)
        response.end(JSON.stringify({
            data: { status: 'processing', checkout_intent_id: 'intent-1' },
        }))
    } else if (url.pathname === '/api/integration/v1/payments/izipay/intents/intent-1/status') {
        const authorized = request.headers['x-checkout-access'] === 'checkout-access'
        response.writeHead(authorized ? 200 : 401)
        response.end(JSON.stringify(authorized
            ? { data: { status: 'completed', id: 'payment-order-1', codigo: 'SUNKA-PAY', access_token: 'payment-access' } }
            : { type: 'urn:itderp:problem:integration-payment-access-invalid', title: 'Acceso al pago inválido', status: 401, detail: 'El acceso al intento de pago no es válido o ha vencido.', instance: '/api/integration/v1/payments/izipay/intents/intent-1/status', errorCode: 'INTEGRATION_PAYMENT_ACCESS_INVALID' }))
    } else {
        response.writeHead(404)
        response.setHeader('content-type', 'application/problem+json')
        response.end(JSON.stringify({
            type: 'urn:itderp:problem:integration-route-not-found',
            title: 'Ruta no encontrada',
            status: 404,
            detail: 'La ruta de integración solicitada no existe.',
            instance: request.url || '/',
            errorCode: 'INTEGRATION_ROUTE_NOT_FOUND',
        }))
    }
}).listen(4011, '127.0.0.1')
