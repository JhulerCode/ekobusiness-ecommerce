export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
    },
    extend: {
      colors: {
        primary: "#4B8F67",   // verde herbal
        secondary: "#CFAE7E", // dorado/beige
        neutral: {
          dark: "#000000",
          medium: "#666666",
          light: "#F9F9F9",
        },
        error: "#E63946",
        success: "#2A9D8F",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}