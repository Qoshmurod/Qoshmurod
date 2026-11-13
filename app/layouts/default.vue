<script setup lang="ts">
const { data: site } = useSite()
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
