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
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div class="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-brand-200/40 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute top-40 -left-32 size-80 rounded-full bg-accent-100/60 blur-3xl" aria-hidden="true" />
      <div class="container-site relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:py-28">
        <div class="space-y-7">
          <p v-if="hours" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm ring-1 ring-brand-100">
            <span class="relative flex size-2.5">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-60" />
              <span class="relative inline-flex size-2.5 rounded-full bg-brand-500" />
            </span>
            {{ t('hero.hours') }}: {{ hours }}
          </p>
          <h1 class="text-4xl leading-[1.1] font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl">{{ heroTitle }}</h1>
          <p class="max-w-xl text-lg leading-relaxed text-pretty text-slate-600">{{ heroText }}</p>
          <div class="flex flex-wrap gap-3">
            <a v-if="tel" :href="tel" class="btn-primary"><AppIcon name="phone" class="size-4" />{{ t('hero.call') }}</a>
            <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="btn-ghost"><AppIcon name="send" class="size-4" />{{ t('hero.telegram') }}</a>
            <NuxtLink v-if="!tel && !telegram" :to="`${localePath('/')}#contacts`" class="btn-primary">{{ t('nav.contacts') }}</NuxtLink>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-md lg:max-w-none">
          <div class="relative aspect-square rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-brand-800 p-8 shadow-2xl shadow-brand-900/20">
            <svg viewBox="0 0 400 400" class="absolute inset-0 size-full text-white/10" aria-hidden="true">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="currentColor" stroke-width="1" /></pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
            </svg>
            <div class="relative flex h-full flex-col justify-between">
              <div>
                <div class="grid size-20 place-items-center rounded-3xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                  <AppIcon name="heart" class="size-10" />
                </div>
                <p class="mt-6 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{{ site?.hospitalName }}</p>
              </div>
              <svg viewBox="0 0 320 80" class="mb-10 w-full text-brand-200" aria-hidden="true">
                <path d="M0 40h90l14-26 22 52 18-38 12 12h164" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div v-if="site?.address" class="absolute -bottom-6 -left-4 hidden max-w-[17rem] items-start gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 sm:flex">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><AppIcon name="pin" class="size-5" /></span>
            <p class="text-sm leading-snug font-semibold text-slate-700">{{ site.address }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section v-if="aboutBlocks" id="about" class="py-20 sm:py-24">
      <div class="container-site grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div class="space-y-3">
          <p class="eyebrow">{{ site?.hospitalName }}</p>
          <h2 class="section-title">{{ t('about.title') }}</h2>
        </div>
        <ArticleBody :content="aboutBlocks" />
      </div>
    </section>

    <!-- News -->
    <section class="bg-slate-50 py-20 sm:py-24">
      <div class="container-site space-y-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-3">
            <p class="eyebrow">{{ t('news.title') }}</p>
            <h2 class="section-title">{{ t('news.latest') }}</h2>
          </div>
          <NuxtLink v-if="news?.items.length" :to="localePath('/news')" class="btn-ghost">
            {{ t('news.all') }}
            <AppIcon name="arrowRight" class="size-4" />
          </NuxtLink>
        </div>
        <div v-if="news?.items.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="a in news.items" :key="a.id" :article="a" />
        </div>
        <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <AppIcon name="newspaper" class="mx-auto size-10 text-slate-300" />
          <p class="mt-3 font-semibold text-slate-500">{{ t('news.empty') }}</p>
        </div>
      </div>
    </section>

    <!-- Contacts -->
    <section id="contacts" class="py-20 sm:py-24">
      <div class="container-site space-y-10">
        <div class="space-y-3">
          <p class="eyebrow">{{ t('contacts.title') }}</p>
          <h2 class="section-title">{{ t('contacts.subtitle') }}</h2>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-if="site?.address" class="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <span class="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><AppIcon name="pin" class="size-5" /></span>
            <p class="mt-5 text-sm font-semibold text-slate-500">{{ t('contacts.address') }}</p>
            <p class="mt-1 font-bold text-slate-900">{{ site.address }}</p>
            <a v-if="map" :href="map" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900">
              {{ t('contacts.map') }} <AppIcon name="external" class="size-3.5" />
            </a>
          </div>
          <div v-if="tel" class="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <span class="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><AppIcon name="phone" class="size-5" /></span>
            <p class="mt-5 text-sm font-semibold text-slate-500">{{ t('contacts.phone') }}</p>
            <a :href="tel" class="mt-1 block font-bold text-slate-900 hover:text-brand-800">{{ site?.phone }}</a>
          </div>
          <div v-if="hours" class="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <span class="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><AppIcon name="clock" class="size-5" /></span>
            <p class="mt-5 text-sm font-semibold text-slate-500">{{ t('contacts.hours') }}</p>
            <p class="mt-1 font-bold text-slate-900">{{ hours }}</p>
          </div>
          <div v-if="telegram || instagram" class="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <span class="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><AppIcon name="send" class="size-5" /></span>
            <p class="mt-5 text-sm font-semibold text-slate-500">{{ [telegram && t('contacts.telegram'), instagram && t('contacts.instagram')].filter(Boolean).join(' · ') }}</p>
            <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="mt-1 flex items-center gap-2 font-bold text-slate-900 hover:text-brand-800"><AppIcon name="send" class="size-4 text-slate-400" />{{ socialHandle(telegram) }}</a>
            <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="mt-1 flex items-center gap-2 font-bold text-slate-900 hover:text-brand-800"><AppIcon name="instagram" class="size-4 text-slate-400" />{{ socialHandle(instagram) }}</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
