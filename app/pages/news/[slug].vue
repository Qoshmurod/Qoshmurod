<script setup lang="ts">
import type { ArticleFull } from '#shared/types'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const formatDate = useFormatDate()
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useFetch<ArticleFull>(() => `/api/articles/${slug.value}`, {
  query: { locale },
  key: computed(() => `article-${locale.value}-${slug.value}`),
})
if (error.value || !article.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Not found', fatal: true })
}

const cover = computed(() => (article.value?.hasCover ? `/media/cover/${article.value.id}?v=${encodeURIComponent(article.value.updatedAt)}` : null))
const site = config.public.siteUrl.replace(/\/+$/, '')

useSeoMeta({
  title: () => article.value?.title ?? '',
  description: () => article.value?.excerpt ?? '',
  ogTitle: () => article.value?.title ?? '',
  ogDescription: () => article.value?.excerpt ?? '',
  ogType: 'article',
  ogImage: () => (cover.value ? `${site}${cover.value}` : undefined),
  articlePublishedTime: () => article.value?.publishedAt ?? undefined,
  twitterCard: () => (cover.value ? 'summary_large_image' : 'summary'),
})
</script>

<template>
  <article v-if="article" class="pb-20">
    <header class="border-b border-default bg-muted">
      <div class="container-site max-w-3xl space-y-5 pt-8 pb-10 sm:pt-12">
        <UButton :to="localePath('/news')" variant="link" icon="i-lucide-arrow-left" :label="t('news.back')" class="px-0" />
        <h1 class="text-3xl leading-tight font-bold tracking-tight text-balance text-highlighted sm:text-4xl">{{ article.title }}</h1>
        <p class="flex items-center gap-1.5 text-sm text-muted">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <time :datetime="article.publishedAt ?? undefined">{{ formatDate(article.publishedAt) }}</time>
        </p>
        <p v-if="article.excerpt" class="text-lg text-toned">{{ article.excerpt }}</p>
      </div>
    </header>
    <div class="container-site max-w-3xl space-y-8 pt-10">
      <img v-if="cover" :src="cover" :alt="article.title" class="aspect-[16/9] w-full rounded-xl object-cover ring-1 ring-default">
      <ArticleBody :content="article.content" />
      <USeparator />
      <UButton :to="localePath('/news')" color="neutral" variant="outline" icon="i-lucide-arrow-left" :label="t('news.back')" />
    </div>
  </article>
</template>
