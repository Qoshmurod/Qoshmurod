<script setup lang="ts">
import type { ArticleFull, ArticlePage } from '#shared/types'

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

const cover = computed(() => (article.value ? articleCover(article.value) : null))
const site = config.public.siteUrl.replace(/\/+$/, '')
const pageUrl = computed(() => `${site}${localePath(`/news/${slug.value}`)}`)
const minutes = computed(() => readingMinutes(article.value?.content))
const { data: clinic } = useSite()

// Three more articles of the same language, newest first
const { data: related } = useFetch<ArticlePage>('/api/articles', {
  query: { locale, limit: 3, exclude: slug },
  key: computed(() => `related-${locale.value}-${slug.value}`),
})

useHead(() => ({
  link: [{ rel: 'canonical', href: pageUrl.value }],
  script: article.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.value.title,
          description: article.value.excerpt ?? undefined,
          datePublished: article.value.publishedAt ?? undefined,
          dateModified: article.value.updatedAt,
          mainEntityOfPage: pageUrl.value,
          ...(cover.value ? { image: [`${site}${cover.value}`] } : {}),
          publisher: { '@type': 'Organization', name: clinic.value?.hospitalName ?? '', ...(clinic.value?.hasLogo ? { logo: { '@type': 'ImageObject', url: `${site}/media/logo` } } : {}) },
        }),
      }]
    : [],
}))

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
  <article v-if="article" class="pb-16">
    <header class="border-b border-default bg-muted">
      <div class="container-site max-w-3xl space-y-5 pt-6 pb-10 sm:pt-8">
        <UBreadcrumb :items="[{ label: t('nav.home'), icon: 'i-lucide-house', to: localePath('/') }, { label: t('nav.news'), to: localePath('/news') }]" />
        <h1 class="text-3xl leading-tight font-bold tracking-tight text-balance text-highlighted sm:text-4xl">{{ article.title }}</h1>
        <p class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span class="flex items-center gap-1.5">
            <UIcon name="i-lucide-calendar" class="size-4" />
            <time :datetime="article.publishedAt ?? undefined">{{ formatDate(article.publishedAt) }}</time>
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-lucide-clock-3" class="size-4" />
            {{ t('news.minRead', { n: minutes }) }}
          </span>
        </p>
        <p v-if="article.excerpt" class="text-lg text-toned">{{ article.excerpt }}</p>
      </div>
    </header>

    <div class="container-site max-w-3xl space-y-8 pt-8">
      <img v-if="cover" :src="cover" :alt="article.title" class="aspect-[16/9] w-full rounded-xl object-cover ring-1 ring-default" fetchpriority="high">
      <ArticleBody :content="article.content" class="text-[1.0625rem]" />
      <USeparator />
      <div class="flex flex-wrap items-center justify-between gap-4">
        <ShareButtons :url="pageUrl" :title="article.title" />
        <UButton :to="localePath('/news')" color="neutral" variant="ghost" icon="i-lucide-arrow-left" :label="t('news.back')" />
      </div>
    </div>

    <section v-if="related?.items.length" class="container-site mt-16 space-y-6">
      <h2 class="section-title">{{ t('news.related') }}</h2>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="a in related.items" :key="a.id" :article="a" />
      </div>
    </section>
  </article>
</template>
