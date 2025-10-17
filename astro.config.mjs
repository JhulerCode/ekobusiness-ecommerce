import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  adapter: vercel(),
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()]
  }
});