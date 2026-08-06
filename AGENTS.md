# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before making changes.

## Project Overview

E-commerce storefront for **SUNKA Herbal Tea** (Peruvian herbal tea brand). It is an
[Astro](https://astro.build) site (SSR) with **Vue 3** islands and **Tailwind CSS v4**, deployed to
**Vercel**. The storefront talks to an external REST API (an IT ERP backend) through a thin wrapper
in `src/lib/api.js`.

- All user-facing copy is **Spanish (es-PE)**.
- Prices are in Peruvian Soles and rendered as `S/ {valor}`.
- Dates/locale use `es-PE`.
- There is **no TypeScript** anywhere: source is plain `.js`, `.astro`, and `.vue`.

## Tech Stack

- **Astro 5** — `output: 'server'`, adapter `@astrojs/vercel` (see `astro.config.mjs`).
- **Vue 3** — Options API components mounted as islands with `client:load`.
- **Tailwind CSS 4** — via `@tailwindcss/vite`; theme tokens defined in `src/styles/global.css` using the `@theme` directive.
- **pnpm** — the package manager (see `packageManager` in `package.json`). Never use npm/yarn.

## Commands

All commands run from the repo root with pnpm:

```sh
pnpm install        # install dependencies
pnpm dev            # start dev server (default http://localhost:4321)
pnpm build          # production build (SSR, outputs to dist/)
pnpm preview        # preview the production build locally
pnpm astro -- --help # Astro CLI help
```

- **Tests:** there are no tests and no test framework configured. Do not invent a test runner; run
  `pnpm build` to verify your changes compile.
- **Lint/format:** there is **no ESLint, Biome, or lint script**. Formatting is defined by
  `.prettierrc.json` + `.editorconfig` (see below). Run `pnpm build` to validate.
- **Typecheck:** `pnpm astro check` requires `@astrojs/check`/`typescript`, which are NOT installed.
  Rely on `pnpm build` instead.
- Local development expects the backend API at the URL in `.env` (`PUBLIC_API_URL`, currently
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
  lib/             # client-side logic + API wrapper
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
- Always include the explicit file extension for `.js` imports (`from '@/lib/api.js'`); `.astro` and
  `.vue` extensions are optional but conventionally included.
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
- Data fetching happens in the frontmatter with top-level `await` using `get(...)` from `@/lib/api.js`.
- When a record is missing, return early with `Astro.rewrite('/404')` (never a hard error).
- Normalize fetched records with the helpers in `src/lib/api.js` (`formatProductos`, `formatLineas`,
  `formatCategorias`) before passing them to components.
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

### API Layer & Error Handling

- Use `src/lib/api.js`: `get(endpoint, { qry }, user_token)`, `post`, `patch`, `delet`, with
  endpoint keys from the `urls` map (`'productos'`, `'lineas'`, `'categorias'`, `'newsletter'`, ...).
- Queries use the ERP filter shape:
  ```js
  { fltr: { activo: { op: 'Es', val: true }, is_ecommerce: { op: 'Es', val: true } }, cols: [...], incl: [...] }
  ```
- Every response is `{ code, msg, data }`: `code === 0` = success, `code > 0` = error with `msg`,
  `code === -1` = generic failure, HTTP `401` = session expired (clears `token` from localStorage).
- Check `res.code != 0` for errors and surface `res.msg` to the user; wrap `await` in `try/catch`
  with a user-friendly Spanish fallback message and always reset `loading` in `finally`.
- Keep validation (email regex, required fields) in the component before submitting.
- The wrapper already `console.log`s messages via `jmsg`; do not duplicate logging.
- Auth token is stored in `localStorage` under `token` and sent as `Authorization: Bearer <token>`.

### Environment Variables

- Client-exposed vars must be prefixed with `PUBLIC_` (Astro rule). Current vars (see `.env`,
  gitignored): `PUBLIC_API_URL`, `PUBLIC_IZIPAY_PUBLIC_KEY`, `RECAPTCHA_SITE_KEY`.
- API base is `PUBLIC_API_URL` + `/ecommerce/...`. Never hardcode URLs or leak secrets.

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
