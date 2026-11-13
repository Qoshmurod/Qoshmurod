<script setup lang="ts">
import type { ArticlePage } from '#shared/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const { data: news } = useFetch<ArticlePage>('/api/articles', {
  query: { locale, limit: 7 },
  key: computed(() => `home-news-${locale.value}`),
})

const texts = computed(() => site.value?.texts)
const heroTitle = computed(() => texts.value?.heroTitle || site.value?.hospitalName || '')
const heroText = computed(() => texts.value?.heroText || t('hero.fallback'))
const aboutBlocks = computed(() => texts.value?.about ?? '')
const hours = computed(() => (site.value?.workingHours ? `${site.value.workingHours.start} – ${site.value.workingHours.end}` : ''))
const tel = computed(() => phoneHref(site.value?.phone))
const telegram = computed(() => socialUrl(site.value?.telegram, 't.me'))
const instagram = computed(() => socialUrl(site.value?.instagram, 'instagram.com'))
const map = computed(() => mapUrl(site.value?.address))
const featured = computed(() => news.value?.items[0])
const side = computed(() => news.value?.items.slice(1, 4) ?? [])
const more = computed(() => news.value?.items.slice(4, 7) ?? [])

// Search engines: the clinic as a medical organization (name, phone, address, hours)
const config = useRuntimeConfig()
useHead(() => ({
  script: site.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'MedicalClinic',
          name: site.value.hospitalName,
          url: config.public.siteUrl,
          ...(site.value.phone ? { telephone: site.value.phone } : {}),
          ...(site.value.address ? { address: site.value.address } : {}),
          ...(site.value.hasLogo ? { logo: `${config.public.siteUrl.replace(/\/+$/, '')}/media/logo` } : {}),
          ...(site.value.workingHours ? { openingHours: `Mo-Su ${site.value.workingHours.start}-${site.value.workingHours.end}` } : {}),
          sameAs: [telegram.value, instagram.value].filter(Boolean),
        }),
      }]
    : [],
}))

useSeoMeta({
  title: () => site.value?.hospitalName ?? '',
  description: () => heroText.value,
  ogTitle: () => heroTitle.value,
  ogDescription: () => heroText.value,
  ogType: 'website',
})
</script>

<template>
  <div>
    <!-- Intro: same brand panel as the Clinika sign-in screen, kept short so the news is right below -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-sky-700 text-white">
      <div class="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <svg class="pointer-events-none absolute top-1/2 right-6 hidden size-56 -translate-y-1/2 text-white/5 lg:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
      </svg>
      <div class="container-site relative flex flex-col gap-6 py-10 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl space-y-4">
          <p v-if="hours" class="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20">
            <UIcon name="i-lucide-clock" class="size-4" />
            {{ t('hero.hours') }}: {{ hours }}
          </p>
          <h1 class="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">{{ heroTitle }}</h1>
          <p class="text-pretty text-white/80 sm:text-lg">{{ heroText }}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton v-if="tel" :href="tel" size="lg" color="neutral" icon="i-lucide-phone" :label="t('hero.call')" class="bg-white text-primary-700 hover:bg-white/90" />
          <UButton v-if="telegram" :href="telegram" target="_blank" rel="noopener" size="lg" color="neutral" variant="outline" icon="i-lucide-send" :label="t('hero.telegram')" class="bg-transparent text-white ring-white/40 hover:bg-white/10" />
        </div>
      </div>
    </section>

    <!-- News: the main part of the site -->
    <section class="py-10 sm:py-14">
      <div class="container-site space-y-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <p class="eyebrow">{{ t('news.title') }}</p>
            <h2 class="section-title">{{ t('news.latest') }}</h2>
          </div>
          <UButton v-if="news?.items.length" :to="localePath('/news')" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" :label="t('news.all')" />
        </div>

        <template v-if="featured">
          <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <ArticleCard :article="featured" variant="featured" />
            <div v-if="side.length" class="flex flex-col gap-1 rounded-xl p-2 ring-1 ring-default">
              <ArticleCard v-for="a in side" :key="a.id" :article="a" variant="compact" />
            </div>
          </div>
          <div v-if="more.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ArticleCard v-for="a in more" :key="a.id" :article="a" />
          </div>
        </template>
        <UEmpty v-else icon="i-lucide-newspaper" :title="t('news.empty')" variant="outline" />
      </div>
    </section>

    <!-- About -->
    <section v-if="aboutBlocks" id="about" class="border-y border-default bg-muted py-12 sm:py-16">
      <div class="container-site grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div class="space-y-2">
          <p class="eyebrow">{{ site?.hospitalName }}</p>
          <h2 class="section-title">{{ t('about.title') }}</h2>
        </div>
        <ArticleBody :content="aboutBlocks" />
      </div>
    </section>

    <!-- Contacts -->
    <section id="contacts" class="py-12 sm:py-16">
      <div class="container-site space-y-8">
        <div class="space-y-2">
          <p class="eyebrow">{{ t('contacts.title') }}</p>
          <h2 class="section-title">{{ t('contacts.subtitle') }}</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard v-if="site?.address">
            <span class="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-map-pin" class="size-5" /></span>
            <p class="mt-4 text-sm text-muted">{{ t('contacts.address') }}</p>
            <p class="mt-1 font-semibold text-highlighted">{{ site.address }}</p>
            <UButton v-if="map" :href="map" target="_blank" rel="noopener" variant="link" class="mt-2 px-0" trailing-icon="i-lucide-external-link" :label="t('contacts.map')" />
          </UCard>
          <UCard v-if="tel">
            <span class="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-phone" class="size-5" /></span>
            <p class="mt-4 text-sm text-muted">{{ t('contacts.phone') }}</p>
            <a :href="tel" class="mt-1 block font-semibold text-highlighted tabular-nums hover:text-primary">{{ site?.phone }}</a>
          </UCard>
          <UCard v-if="hours">
            <span class="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-clock" class="size-5" /></span>
            <p class="mt-4 text-sm text-muted">{{ t('contacts.hours') }}</p>
            <p class="mt-1 font-semibold text-highlighted tabular-nums">{{ hours }}</p>
          </UCard>
          <UCard v-if="telegram || instagram">
            <span class="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-message-circle" class="size-5" /></span>
            <p class="mt-4 text-sm text-muted">{{ [telegram && t('contacts.telegram'), instagram && t('contacts.instagram')].filter(Boolean).join(' · ') }}</p>
            <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="mt-1 flex items-center gap-2 font-semibold text-highlighted hover:text-primary"><UIcon name="i-lucide-send" class="size-4 text-dimmed" />{{ socialHandle(telegram) }}</a>
            <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="mt-1 flex items-center gap-2 font-semibold text-highlighted hover:text-primary"><UIcon name="i-lucide-instagram" class="size-4 text-dimmed" />{{ socialHandle(instagram) }}</a>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>
