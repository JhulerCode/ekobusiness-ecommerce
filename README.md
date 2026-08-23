# SUNKA Ecommerce

Tienda SSR construida con Astro 5, Vue 3, TypeScript estricto y Tailwind CSS 4. Astro funciona como Backend for Frontend (BFF): el navegador consume exclusivamente rutas del mismo origen bajo `/api/*` y el BFF se comunica con `/api/integration/v1/*` del ERP.

## Desarrollo

1. Copia `.env.example` a `.env` y configura las variables.
2. Crea la integración y su clave con el comando `integration-keys` del backend.
3. Inicia Express en `http://localhost:4000` y luego ejecuta `pnpm dev`.

Producción exige una API key activa con los scopes usados por la tienda.

## Variables

- `API_URL`: URL privada de Express; nunca se publica en el bundle.
- `ERP_API_KEY`: credencial privada de esta aplicación; identifica empresa y scopes.
- `PUBLIC_IZIPAY_PUBLIC_KEY`: clave pública usada por el SDK de pagos.
- `PUBLIC_RECAPTCHA_SITE_KEY`: site key pública de reCAPTCHA.

`PUBLIC_API_URL` ya no se utiliza.

## Comandos

```sh
pnpm dev
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm verify
```

La primera ejecución E2E requiere `pnpm exec playwright install chromium`.

## Seguridad y despliegue

- Access y refresh tokens se almacenan en cookies `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
- Los tokens temporales de pedido se guardan en cookies con scope por pedido y no aparecen en URLs.
- Las rutas mutables del BFF validan `Origin`; las entradas sensibles se validan con Zod.
- El IPN de Izipay entra directamente a Express en `/api/integration/v1/payments/izipay/ipn` y valida su firma.
- Catálogo, sistema y ubigeos permiten caché pública corta. Cuenta, pedidos y pagos son `no-store`.

Antes de producción, ejecutar `pnpm verify`, `pnpm test:e2e` y smoke tests reales de signin, refresh, ARCO multipart, libro de reclamaciones, Yape, tarjeta, IPN y consulta de pedido.
