<script setup lang="ts">
const { data: site, error: siteError } = await useSite()
// Website turned off in the Clinika settings: every page shows "temporarily unavailable" (503)
if (siteError.value?.statusCode === 503 && !useError().value) {
  throw createError({ statusCode: 503, statusMessage: 'Website turned off', fatal: true })
}
const head = useLocaleHead({ seo: true })
const config = useRuntimeConfig()
const { locale } = useI18n()

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: [...(head.value.link ?? []), { rel: 'alternate', type: 'application/rss+xml', title: site.value?.hospitalName ?? 'RSS', href: `/feed/${locale.value}.xml` }],
  meta: [...(head.value.meta ?? [])],
  titleTemplate: (title?: string) => {
    const name = site.value?.hospitalName ?? ''
    return title && title !== name ? `${title} — ${name}` : name
  },
}))
useSeoMeta({
  ogSiteName: () => site.value?.hospitalName ?? '',
  ogImage: () => (site.value?.hasLogo ? `${config.public.siteUrl.replace(/\/+$/, '')}/media/logo` : undefined),
})
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
