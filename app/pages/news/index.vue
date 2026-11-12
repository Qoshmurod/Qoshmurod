<script setup lang="ts">
import type { ArticlePage } from '#shared/types'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const page = computed(() => Math.max(1, Number.parseInt(String(route.query.page ?? '1'), 10) || 1))
const { data: news } = useFetch<ArticlePage>('/api/articles', {
  query: { locale, page, limit: 9 },
  key: computed(() => `news-${locale.value}-${page.value}`),
})
const totalPages = computed(() => news.value?.meta.totalPages ?? 1)
const pageLink = (p: number) => ({ path: localePath('/news'), query: p > 1 ? { page: p } : {} })

useSeoMeta({
  title: () => t('news.title'),
  description: () => t('news.subtitle'),
  ogTitle: () => t('news.title'),
  ogDescription: () => t('news.subtitle'),
})
</script>

<template>
  <div>
    <section class="bg-gradient-to-b from-brand-50 to-white">
      <div class="container-site space-y-4 py-16 sm:py-20">
        <p class="eyebrow">{{ t('nav.news') }}</p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{{ t('news.title') }}</h1>
        <p class="max-w-2xl text-lg text-slate-600">{{ t('news.subtitle') }}</p>
      </div>
    </section>
    <section class="container-site pb-24">
      <div v-if="news?.items.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in news.items" :key="a.id" :article="a" />
      </div>
      <div v-else class="rounded-3xl border border-dashed border-slate-300 px-6 py-20 text-center">
        <AppIcon name="newspaper" class="mx-auto size-12 text-slate-300" />
        <p class="mt-4 text-lg font-semibold text-slate-500">{{ t('news.empty') }}</p>
      </div>
      <nav v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-3" aria-label="Pagination">
        <NuxtLink v-if="page > 1" :to="pageLink(page - 1)" class="btn-ghost"><AppIcon name="arrowLeft" class="size-4" />{{ t('news.prev') }}</NuxtLink>
        <span class="px-2 text-sm font-semibold text-slate-500">{{ t('news.page', { page, total: totalPages }) }}</span>
        <NuxtLink v-if="page < totalPages" :to="pageLink(page + 1)" class="btn-ghost">{{ t('news.next') }}<AppIcon name="arrowRight" class="size-4" /></NuxtLink>
      </nav>
    </section>
  </div>
</template>
