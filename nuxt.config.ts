// The website is rendered on the server (SEO). It talks to the Clinika backend only from the server side
// (server/ routes), so the browser never calls the clinic API and no CORS setup is needed there.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  
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
      { code: 'uz-cyrl', language: 'uz-Cyrl-UZ', name: 'Ўзбекча', file: 'uz-cyrl.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uz' },
      meta: [{ name: 'theme-color', content: '#0d9488' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  // Same look as the Clinika staff app: Nuxt UI, teal/slate palette (app.config.ts), Inter, light/dark by system setting
  colorMode: {
    preference: 'system',
    fallback: 'light',
    storageKey: 'clinika-website-color-mode',
  },
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
    },
  },
  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800] }],
  },

  routeRules: {
    // Basic hardening for every page: no framing by other sites, no MIME sniffing, minimal referrer, no device APIs
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      },
    },
    // Images change rarely; the backend already sends a 1-day cache header
    '/media/**': { headers: { 'X-Content-Type-Options': 'nosniff' } },
  },
})
