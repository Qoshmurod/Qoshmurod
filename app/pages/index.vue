<script setup lang="ts">
import type { ArticlePage } from '#shared/types'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const { data: news } = useFetch<ArticlePage>('/api/articles', {
  query: { locale, limit: 3 },
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
    <!-- Hero: same brand panel as the Clinika sign-in screen -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-sky-700 text-white">
      <div class="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
      <svg class="pointer-events-none absolute top-1/2 right-6 hidden size-72 -translate-y-1/2 text-white/5 lg:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
      </svg>
      <div class="container-site relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:py-24">
        <div class="max-w-2xl space-y-6">
          <p v-if="hours" class="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20">
            <UIcon name="i-lucide-clock" class="size-4" />
            {{ t('hero.hours') }}: {{ hours }}
          </p>
          <h1 class="text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">{{ heroTitle }}</h1>
          <p class="text-lg text-pretty text-white/80">{{ heroText }}</p>
          <div class="flex flex-wrap gap-3">
            <UButton v-if="tel" :href="tel" size="xl" color="neutral" variant="solid" icon="i-lucide-phone" :label="t('hero.call')" class="bg-white text-primary-700 hover:bg-white/90" />
            <UButton v-if="telegram" :href="telegram" target="_blank" rel="noopener" size="xl" color="neutral" variant="outline" icon="i-lucide-send" :label="t('hero.telegram')" class="bg-transparent text-white ring-white/40 hover:bg-white/10" />
            <UButton v-if="!tel && !telegram" :to="`${localePath('/')}#contacts`" size="xl" color="neutral" :label="t('nav.contacts')" class="bg-white text-primary-700" />
          </div>
        </div>

        <ul class="space-y-4">
          <li v-if="site?.address" class="flex gap-4">
            <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-white/20"><UIcon name="i-lucide-map-pin" class="size-5" /></span>
            <span><span class="block font-semibold">{{ t('contacts.address') }}</span><span class="block text-sm text-white/75">{{ site.address }}</span></span>
          </li>
          <li v-if="site?.phone" class="flex gap-4">
            <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-white/20"><UIcon name="i-lucide-phone" class="size-5" /></span>
            <span><span class="block font-semibold">{{ t('contacts.phone') }}</span><span class="block text-sm text-white/75">{{ site.phone }}</span></span>
          </li>
          <li v-if="hours" class="flex gap-4">
            <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-white/15 ring-1 ring-white/20"><UIcon name="i-lucide-clock" class="size-5" /></span>
            <span><span class="block font-semibold">{{ t('contacts.hours') }}</span><span class="block text-sm text-white/75">{{ hours }}</span></span>
          </li>
        </ul>
      </div>
    </section>

    <!-- About -->
    <section v-if="aboutBlocks" id="about" class="py-16 sm:py-20">
      <div class="container-site grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div class="space-y-2">
          <p class="eyebrow">{{ site?.hospitalName }}</p>
          <h2 class="section-title">{{ t('about.title') }}</h2>
        </div>
        <ArticleBody :content="aboutBlocks" />
      </div>
    </section>

    <!-- News -->
    <section class="border-y border-default bg-muted py-16 sm:py-20">
      <div class="container-site space-y-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <p class="eyebrow">{{ t('news.title') }}</p>
            <h2 class="section-title">{{ t('news.latest') }}</h2>
          </div>
          <UButton v-if="news?.items.length" :to="localePath('/news')" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" :label="t('news.all')" />
        </div>
        <div v-if="news?.items.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in news.items" :key="a.id" :article="a" />
        </div>
        <UEmpty v-else icon="i-lucide-newspaper" :title="t('news.empty')" variant="outline" class="bg-default" />
      </div>
    </section>

    <!-- Contacts -->
    <section id="contacts" class="py-16 sm:py-20">
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
