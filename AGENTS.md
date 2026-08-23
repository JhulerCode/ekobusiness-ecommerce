# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making changes.

## Project Overview

E-commerce storefront for **SUNKA Herbal Tea** (Peruvian herbal tea brand). It is an
[Astro](https://astro.build) site (SSR) with **Vue 3** islands and **Tailwind CSS v4**, deployed to
**Vercel**. Astro acts as a BFF: browser code calls same-origin `/api/*` routes, while server-only
code talks to the ERP through `src/lib/server/backend.ts`.

- All user-facing copy is **Spanish (es-PE)**.
- Prices are in Peruvian Soles and rendered as `S/ {valor}`.
- Dates/locale use `es-PE`.
- TypeScript is strict. All Vue scripts use `lang="ts"` and Options API with `defineComponent`.

## Tech Stack

- **Astro 5** — `output: 'server'`, adapter `@astrojs/vercel` (see `astro.config.mjs`).
- **Vue 3** — Options API components mounted as islands with `client:load`.
- **Tailwind CSS 4** — via `@tailwindcss/vite`; theme tokens defined in `src/styles/global.css` using the `@theme` directive.
- **pnpm** — the package manager (see `packageManager` in `package.json`). Never use npm/yarn.
- **Vitest + Playwright** — unit/contract tests and browser flows.

## Commands

All commands run from the repo root with pnpm:

```sh
pnpm install        # install dependencies
pnpm dev            # start dev server (default http://localhost:4321)
pnpm build          # production build (SSR, outputs to dist/)
pnpm typecheck      # Astro/TypeScript diagnostics
pnpm test           # Vitest suite
pnpm test:e2e       # Playwright suite
pnpm verify         # typecheck + unit tests + build
pnpm preview        # preview the production build locally
pnpm astro -- --help # Astro CLI help
```

- Add unit tests under `tests/unit` and browser flows under `tests/e2e`.
- **Lint/format:** there is **no ESLint, Biome, or lint script**. Formatting is defined by
  `.prettierrc.json` + `.editorconfig` (see below). Run `pnpm build` to validate.
- **Typecheck:** run `pnpm typecheck`; all changes must keep strict diagnostics at zero errors.
- Local development expects the backend API at the private URL in `.env` (`API_URL`, usually
  `http://localhost:4000`). Pages that call the API will return empty data / rewrite to `/404`
  without it.

## Project Structure

```
src/
  assets/          # images (.webp/.jpg/.svg/.mp4) and icon components (.astro/.vue)
    icons/         #   icons — icon-*.astro for static, *.vue for interactive
  components/      # reusable components
    home/          #   home page section components
    lineas/        #   product-line page sections (+ signature/ subfolder)
    origen/        #   "origen" page sections
    inspiracion/   #   inspiracion page sections
    shared/        #   cross-page components (e.g. HeroPremium)
    tienda/        #   tienda page components
    *.vue          #   interactive islands (cart, auth, forms, etc.)
  data/            # static site data (lineas.js, momentos.js)
  layouts/         # BaseLayout.astro (used by every page)
  lib/             # typed client logic, schemas, and server-only backend client
  pages/api/       # explicit BFF endpoints
  pages/           # routes; [slug].astro files are dynamic routes
  styles/          # global.css (Tailwind theme + global utilities)
```

- Images are imported as modules (e.g. `import banner from '@/assets/banner1.webp'`) so Astro
  optimizes them. Never reference `src/assets` via a raw URL.
- `dist/`, `.astro/`, `.vercel/`, `node_modules/`, `mockups/` are gitignored build artifacts.

## Code Style

### Formatting

Canonical settings (from `.prettierrc.json` and `.editorconfig`):

- **No semicolons**, single quotes, print width **100**.
- Indentation: **4 spaces** (also 4-space in templates/frontmatter), LF line endings, no final newline inserted.
- Do NOT add code comments unless necessary. Existing files mix short Spanish comments; keep them minimal.

> Note: some legacy files (`src/lib/cart.js`, `src/components/Producto.vue`,
> `src/components/tienda/TiendaGrid.vue`, `src/pages/linea/[slug].astro`) use semicolons/double
> quotes and predate the Prettier config. Match the **config** for new code; avoid reformatting
> whole legacy files unless asked.

### Imports & Aliases

- Prefer the alias `@/` → `src/` for cross-folder imports:
  `import BaseLayout from '@/layouts/BaseLayout.astro'`.
- Relative imports are acceptable within the same folder or for in-page scripts (e.g.
  `import { Cart } from '../../lib/cart.js'` inside a `<script>` tag).
- Use extensionless imports for `.ts`; `.astro` and `.vue` extensions remain conventional.
- Imports come first in the frontmatter, then constants/logic.

### Language & Naming

- **Code identifiers in English**: `get`, `formatProductos`, `productosFiltrados`, `applyUrlFilters`.
- **Content/data fields in Spanish** (they mirror the backend): `nombre`, `descripcion`, `titulo`,
  `fotos`, `precio`, `precio_anterior`, `unidad`, `slug`.
- Files/components: **PascalCase** for `.astro`/`.vue` component files (except icons, see below);
  **kebab-case** for icon files (`icon-*.astro`, `chevron-left.vue`); lowercase for `.js` modules.
- Keep Spanish strings unaccented vs accented inconsistent across the codebase; prefer accented
  Spanish in new UI copy (e.g. "preparación").

### Astro Pages & Components

- Every page imports `BaseLayout` and passes `title` (and `description`) props:
  `<BaseLayout title={`X | SUNKA Herbal Tea`}>`.
- Dynamic pages read `Astro.params`, e.g. `const { slug } = Astro.params`.
- Server data fetching uses `serverGet` or `backendRequest`; never call browser helpers from SSR.
- When a record is missing, return early with `Astro.rewrite('/404')` (never a hard error).
- Normalize fetched products with `formatProductos` from `src/lib/api.ts` before passing them to components.
- Pass data to Vue islands via props and mount with `client:load`
  (`<TiendaGrid client:load productos={productos} lineas={lineas} />`).
- Interactive DOM wiring for static pages goes in a page-level `<script>` and is driven by
  `data-*` attributes (`[data-gallery]`, `[data-quantity]`).

### Vue Components

- **Options API only**: `export default { name, components, props, data(), computed, watch, mounted, methods }`.
- Template first, then `<script>`, then optional `<style scoped>`.
- Props are plain objects with `type` and `required`/`default` (arrays/objects use factory defaults).
- Keep data mutations in `methods`; derived values in `computed`; side effects (URL sync, cart
  events) in `watch`/`mounted`.
- Store component-local validation/status flags in `data` (e.g. `loading`, `error`, `showMsg`).
- Names of state and methods are English camelCase.

### Data Files (`src/data/`)

- Export plain JS arrays of objects plus a lookup map and a small accessor:
  `export const lineas`, `export const lineasBySlug`, `export const getLineaBySlug = (slug) => lineasBySlug[slug]`.
- Reference imported assets, not hardcoded URLs.

### API Layer, BFF & Error Handling

- Vue uses `src/lib/api.ts` and only same-origin `/api/*` endpoints. Astro SSR uses the server-only
  client. Never expose `API_URL`, `ERP_API_KEY`, `X-API-Key`, or authorization headers.
- Browser compatibility queries may use the legacy filter shape, but Astro translates them to fixed integration parameters:
  ```js
  { fltr: { activo: { op: 'Es', val: true }, is_ecommerce: { op: 'Es', val: true } }, cols: [...], incl: [...] }
  ```
- Successful responses use `{ data, meta?, warnings? }`; errors use RFC 9457 Problem Details with
  `application/problem+json`. Client helpers return the discriminated `ApiResult<T>` type.
- Check `result.ok`; use `result.problem.type` for behavior and `result.problem.detail` for safe
  user-facing text. HTTP `401` means the HttpOnly session expired. Always reset `loading`.
- Keep validation (email regex, required fields) in the component before submitting.
- The wrapper already `console.log`s messages via `jmsg`; do not duplicate logging.
- Authentication is cookie-based and HttpOnly. Never store or read auth/order tokens in browser code.

### Environment Variables

- Private vars are `API_URL` and `ERP_API_KEY`.
- Browser vars are `PUBLIC_IZIPAY_PUBLIC_KEY` and `PUBLIC_RECAPTCHA_SITE_KEY`.

### Styling & Tailwind

- Reuse the SUNKA palette tokens defined in `global.css` `@theme`:
  `sunka-ink`, `sunka-forest`, `sunka-olive`, `sunka-brass`, `sunka-brass-light`, `sunka-cream`,
  `sunka-sand`, `sunka-stone`, `sunka-white` (e.g. `bg-sunka-cream`, `text-sunka-brass`).
- Use `font-heading` for display type, `font-sans` otherwise.
- Prefer utility classes inline; add shared composite classes (`.button`, `.input`, `.modal`) to
  `global.css` only when reused widely.
- The `.fade-up` class + IntersectionObserver (wired in `BaseLayout`) drives scroll reveals; add
  `.delay-1`/`.delay-2`/`.delay-3` for stagger.
- Keep section markup consistent: `<section>` with a `max-w-7xl mx-auto px-5 md:px-8` container.

### Assets & Icons

- Static decorative icons live as `.astro` (or `.svg`) in `src/assets/icons/`; icons needing Vue
  reactivity/props live as `.vue` (e.g. `chevron-left.vue`).
- Import an icon component and render it, not inline SVGs (unless in a Vue template).

## Workflow Conventions

- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, etc., lowercase
  subject (see `git log`). No other commit discipline is enforced.
- Do not modify `.env`, `pnpm-lock.yaml`, or build artifacts (`dist/`, `.astro/`, `.vercel/`) unless
  the task explicitly requires it.
- After a change, run `pnpm build` to confirm the site compiles.
