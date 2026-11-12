<script setup lang="ts">
import type { ArticleSummary } from '#shared/types'

const props = defineProps<{ article: ArticleSummary; featured?: boolean }>()
const { t } = useI18n()
const localePath = useLocalePath()
const formatDate = useFormatDate()
const cover = computed(() => (props.article.hasCover ? `/media/cover/${props.article.id}?v=${encodeURIComponent(props.article.updatedAt)}` : null))
</script>

<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 hover:ring-brand-200">
    <div class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-accent-50">
      <img v-if="cover" :src="cover" :alt="props.article.title" loading="lazy" class="size-full object-cover transition duration-500 group-hover:scale-105">
      <div v-else class="grid size-full place-items-center text-brand-600/40">
        <AppIcon name="newspaper" class="size-14" />
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-6">
      <p class="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <AppIcon name="calendar" class="size-3.5" />
        <time :datetime="props.article.publishedAt ?? undefined">{{ formatDate(props.article.publishedAt) }}</time>
      </p>
      <h3 class="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-brand-800" :class="props.featured && 'sm:text-xl'">
        <NuxtLink :to="localePath(`/news/${props.article.slug}`)" class="after:absolute after:inset-0">{{ props.article.title }}</NuxtLink>
      </h3>
      <p v-if="props.article.excerpt" class="line-clamp-3 text-sm leading-relaxed text-slate-600">{{ props.article.excerpt }}</p>
      <span class="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-brand-700">
        {{ t('news.readMore') }}
        <AppIcon name="arrowRight" class="size-4 transition group-hover:translate-x-1" />
      </span>
    </div>
  </article>
</template>
