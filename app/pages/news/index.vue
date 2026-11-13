<script setup lang="ts">
import type { ArticlePage } from '#shared/types'

const PER_PAGE = 9
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const page = computed(() => Math.max(1, Number.parseInt(String(route.query.page ?? '1'), 10) || 1))
const q = computed(() => String(route.query.q ?? '').trim())
const { data: news, status } = useFetch<ArticlePage>('/api/articles', {
  query: { locale, page, limit: PER_PAGE, q },
  key: computed(() => `news-${locale.value}-${page.value}-${q.value}`),
})

// Search box: the URL keeps the query (?q=...), so a search can be shared or reloaded
const search = ref(q.value)
watch(q, (v) => (search.value = v))
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const value = v.trim()
    if (value === q.value) return
    void router.replace({ path: localePath('/news'), query: value ? { q: value } : {} })
  }, 350)
})

const items = computed(() => news.value?.items ?? [])
const showFeatured = computed(() => page.value === 1 && !q.value && items.value.length > 0)
const grid = computed(() => (showFeatured.value ? items.value.slice(1) : items.value))
const total = computed(() => news.value?.meta.total ?? 0)
const pageLink = (p: number) => ({ path: localePath('/news'), query: { ...(q.value ? { q: q.value } : {}), ...(p > 1 ? { page: String(p) } : {}) } })

useSeoMeta({
  title: () => t('news.title'),
  description: () => t('news.subtitle'),
  ogTitle: () => t('news.title'),
  ogDescription: () => t('news.subtitle'),
  robots: () => (q.value ? 'noindex, follow' : undefined),
})
</script>

<template>
  <div>
    <section class="border-b border-default bg-muted">
      <div class="container-site flex flex-col gap-6 py-10 sm:py-14 md:flex-row md:items-end md:justify-between">
        <div class="space-y-3">
          <p class="eyebrow">{{ t('nav.news') }}</p>
          <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">{{ t('news.title') }}</h1>
          <p class="max-w-2xl text-muted">{{ t('news.subtitle') }}</p>
        </div>
        <form role="search" class="w-full md:max-w-sm" @submit.prevent>
          <label for="news-search" class="sr-only">{{ t('news.searchLabel') }}</label>
          <UInput
            id="news-search"
            v-model="search"
            type="search"
            size="xl"
            icon="i-lucide-search"
            :placeholder="t('news.search')"
            :loading="status === 'pending'"
            class="w-full"
            :ui="{ base: 'bg-default' }"
          >
            <template v-if="search" #trailing>
              <UButton color="neutral" variant="link" size="sm" icon="i-lucide-x" :aria-label="t('news.clear')" @click="search = ''" />
            </template>
          </UInput>
        </form>
      </div>
    </section>

    <section class="container-site space-y-8 py-10 pb-20">
      <p v-if="q && items.length" class="text-sm text-muted">{{ t('news.results', { n: total }) }}</p>

      <ArticleCard v-if="showFeatured" :article="items[0]!" variant="featured" />

      <div v-if="grid.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in grid" :key="a.id" :article="a" />
      </div>

      <UEmpty
        v-if="!items.length && status !== 'pending'"
        :icon="q ? 'i-lucide-search-x' : 'i-lucide-newspaper'"
        :title="q ? t('news.noResults') : t('news.empty')"
        :description="q ? t('news.noResultsText') : undefined"
        :actions="q ? [{ label: t('news.clear'), icon: 'i-lucide-x', color: 'neutral', variant: 'outline', onClick: () => (search = '') }] : undefined"
        variant="outline"
      />

      <div v-if="(news?.meta.totalPages ?? 1) > 1" class="flex justify-center pt-4">
        <UPagination :page="page" :total="total" :items-per-page="PER_PAGE" :to="pageLink" show-edges />
      </div>
    </section>
  </div>
</template>
