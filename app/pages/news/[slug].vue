<script setup lang="ts">
import type { ArticleFull } from '#shared/types'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const formatDate = useFormatDate()
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useFetch<ArticleFull>(() => `/api/articles/${slug.value}`, { key: computed(() => `article-${slug.value}`) })
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
  <article v-if="article" class="pb-24">
    <header class="bg-gradient-to-b from-brand-50 to-white">
      <div class="container-site max-w-3xl space-y-6 pt-12 pb-10 sm:pt-16">
        <NuxtLink :to="localePath('/news')" class="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">
          <AppIcon name="arrowLeft" class="size-4" />
          {{ t('news.back') }}
        </NuxtLink>
        <h1 class="text-3xl leading-tight font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl">{{ article.title }}</h1>
        <p class="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <AppIcon name="calendar" class="size-4" />
          <time :datetime="article.publishedAt ?? undefined">{{ formatDate(article.publishedAt) }}</time>
        </p>
        <p v-if="article.excerpt" class="text-xl leading-relaxed text-slate-600">{{ article.excerpt }}</p>
      </div>
    </header>
    <div class="container-site max-w-3xl space-y-10">
      <img v-if="cover" :src="cover" :alt="article.title" class="aspect-[16/9] w-full rounded-3xl object-cover shadow-xl shadow-slate-900/10">
      <ArticleBody :content="article.content" />
      <div class="border-t border-slate-200 pt-8">
        <NuxtLink :to="localePath('/news')" class="btn-ghost">
          <AppIcon name="arrowLeft" class="size-4" />
          {{ t('news.back') }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
