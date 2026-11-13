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
    <section class="border-b border-default bg-muted">
      <div class="container-site space-y-3 py-12 sm:py-16">
        <p class="eyebrow">{{ t('nav.news') }}</p>
        <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">{{ t('news.title') }}</h1>
        <p class="max-w-2xl text-muted">{{ t('news.subtitle') }}</p>
      </div>
    </section>
    <section class="container-site py-10 pb-20">
      <div v-if="news?.items.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in news.items" :key="a.id" :article="a" />
      </div>
      <UEmpty v-else icon="i-lucide-newspaper" :title="t('news.empty')" variant="outline" />
      <nav v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
        <UButton v-if="page > 1" :to="pageLink(page - 1)" color="neutral" variant="outline" icon="i-lucide-arrow-left" :label="t('news.prev')" />
        <span class="px-2 text-sm text-muted">{{ t('news.page', { page, total: totalPages }) }}</span>
        <UButton v-if="page < totalPages" :to="pageLink(page + 1)" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" :label="t('news.next')" />
      </nav>
    </section>
  </div>
</template>
