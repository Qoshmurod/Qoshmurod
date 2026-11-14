<script setup lang="ts">
import type { ArticleSummary } from '#shared/types'

/** card — grid item; featured — the newest article, large; compact — a row with a small picture. */
const props = withDefaults(defineProps<{ article: ArticleSummary; variant?: 'card' | 'featured' | 'compact' }>(), { variant: 'card' })
const { t } = useI18n()
const localePath = useLocalePath()
const formatDate = useFormatDate()
const cover = computed(() => articleCover(props.article))
const to = computed(() => localePath(`/news/${props.article.slug}`))
const videoLabel = computed(() => {
  if (!props.article.hasVideo) return ''
  return [formatVideoDuration(props.article.videoDuration) || t('news.video'), videoQualityBadge(props.article)].filter(Boolean).join(' · ')
})
// No cover: the video's own frame
const picture = computed(() => cover.value ?? (props.article.hasVideo ? `/media/poster/${props.article.id}` : null))
</script>

<template>
  <!-- Featured: picture left, text right on wide screens -->
  <article
    v-if="props.variant === 'featured'"
    class="group relative grid overflow-hidden rounded-xl bg-default ring-1 ring-default transition hover:shadow-lg hover:ring-primary/40 md:grid-cols-[1.2fr_1fr]"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-primary/10 md:aspect-auto md:min-h-80">
      <span v-if="videoLabel" class="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white tabular-nums"><UIcon name="i-lucide-play" class="size-3.5" />{{ videoLabel }}</span>
      <img v-if="picture" :src="picture" :alt="props.article.title" class="size-full object-cover transition duration-500 group-hover:scale-105" fetchpriority="high">
      <div v-else class="grid size-full place-items-center bg-gradient-to-br from-primary-600 to-sky-700 text-white/40">
        <UIcon name="i-lucide-newspaper" class="size-20" />
      </div>
    </div>
    <div class="flex flex-col gap-3 p-6 sm:p-8">
      <div class="flex flex-wrap items-center gap-3 text-sm text-muted">
        <UBadge :label="t('news.latestOne')" variant="subtle" />
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <time :datetime="props.article.publishedAt ?? undefined">{{ formatDate(props.article.publishedAt) }}</time>
        </span>
      </div>
      <h3 class="text-2xl leading-tight font-bold tracking-tight text-balance text-highlighted group-hover:text-primary sm:text-3xl">
        <NuxtLink :to="to" class="after:absolute after:inset-0">{{ props.article.title }}</NuxtLink>
      </h3>
      <p v-if="props.article.excerpt" class="line-clamp-4 text-toned">{{ props.article.excerpt }}</p>
      <span class="mt-auto inline-flex items-center gap-1 pt-2 font-medium text-primary">
        {{ t('news.readMore') }}
        <UIcon name="i-lucide-arrow-right" class="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </div>
  </article>

  <!-- Compact: one row -->
  <article v-else-if="props.variant === 'compact'" class="group relative flex gap-4 rounded-lg p-2 transition hover:bg-elevated">
    <div class="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-primary/10 sm:w-24">
      <span v-if="videoLabel" class="absolute right-1 bottom-1 grid size-6 place-items-center rounded-full bg-black/70 text-white"><UIcon name="i-lucide-play" class="size-3.5" /></span>
      <img v-if="picture" :src="picture" :alt="props.article.title" loading="lazy" class="size-full object-cover">
      <div v-else class="grid size-full place-items-center text-primary/50"><UIcon name="i-lucide-newspaper" class="size-7" /></div>
    </div>
    <div class="min-w-0 space-y-1 py-0.5">
      <time class="block text-xs text-muted" :datetime="props.article.publishedAt ?? undefined">{{ formatDate(props.article.publishedAt) }}</time>
      <h3 class="line-clamp-3 font-semibold leading-snug text-highlighted group-hover:text-primary">
        <NuxtLink :to="to" class="after:absolute after:inset-0">{{ props.article.title }}</NuxtLink>
      </h3>
    </div>
  </article>

  <!-- Card -->
  <UCard v-else class="group relative h-full transition hover:shadow-md hover:ring-primary/40" :ui="{ root: 'flex flex-col overflow-hidden', header: 'p-0 sm:p-0', body: 'flex flex-1 flex-col gap-2' }">
    <template #header>
      <div class="relative aspect-[16/10] overflow-hidden bg-primary/10">
        <span v-if="videoLabel" class="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white tabular-nums"><UIcon name="i-lucide-play" class="size-3.5" />{{ videoLabel }}</span>
        <img v-if="picture" :src="picture" :alt="props.article.title" loading="lazy" class="size-full object-cover transition duration-500 group-hover:scale-105">
        <div v-else class="grid size-full place-items-center text-primary/50">
          <UIcon name="i-lucide-newspaper" class="size-12" />
        </div>
      </div>
    </template>
    <p class="flex items-center gap-1.5 text-xs text-muted">
      <UIcon name="i-lucide-calendar" class="size-3.5" />
      <time :datetime="props.article.publishedAt ?? undefined">{{ formatDate(props.article.publishedAt) }}</time>
    </p>
    <h3 class="font-semibold leading-snug text-highlighted group-hover:text-primary">
      <NuxtLink :to="to" class="after:absolute after:inset-0">{{ props.article.title }}</NuxtLink>
    </h3>
    <p v-if="props.article.excerpt" class="line-clamp-3 text-sm text-muted">{{ props.article.excerpt }}</p>
    <span class="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
      {{ t('news.readMore') }}
      <UIcon name="i-lucide-arrow-right" class="size-4 transition group-hover:translate-x-0.5" />
    </span>
  </UCard>
</template>
