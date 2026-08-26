import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    output: 'server',
    adapter: vercel(),
    integrations: [vue()],
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            // Se carga bajo demanda en el paso de pago; precalcularla al iniciar
            // evita que Vite descubra una versión nueva a mitad del checkout.
            include: ['@lyracom/embedded-form-glue'],
        },
    },
})
