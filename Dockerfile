FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app
ARG PUBLIC_IZIPAY_PUBLIC_KEY
ARG PUBLIC_RECAPTCHA_SITE_KEY
ENV PUBLIC_IZIPAY_PUBLIC_KEY=$PUBLIC_IZIPAY_PUBLIC_KEY
ENV PUBLIC_RECAPTCHA_SITE_KEY=$PUBLIC_RECAPTCHA_SITE_KEY
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
