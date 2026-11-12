import tailwindcss from '@tailwindcss/vite'

// The website is rendered on the server (SEO). It talks to the Clinika backend only from the server side
// (server/ routes), so the browser never calls the clinic API and no CORS setup is needed there.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    // NUXT_BACKEND_URL — Clinika API as seen from this server (docker: http://backend:4000/api/v1)
    backendUrl: 'http://localhost:4000/api/v1',
    public: {
      // NUXT_PUBLIC_SITE_URL — public address of the website, for links in sitemap / social previews
      siteUrl: 'http://localhost:3001',
    },
  },

  i18n: {
    defaultLocale: 'uz',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    locales: [
      { code: 'uz', language: 'uz-Latn-UZ', name: 'O‘zbekcha', file: 'uz.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uz' },
      meta: [{ name: 'theme-color', content: '#0f766e' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  routeRules: {
    // Images change rarely; the backend already sends a 1-day cache header
    '/media/**': { headers: { 'X-Content-Type-Options': 'nosniff' } },
  },
})
