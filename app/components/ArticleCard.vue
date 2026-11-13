<script setup lang="ts">
import type { ArticleSummary } from '#shared/types'

const props = defineProps<{ article: ArticleSummary }>()
const { t } = useI18n()
const localePath = useLocalePath()
const formatDate = useFormatDate()
const cover = computed(() => (props.article.hasCover ? `/media/cover/${props.article.id}?v=${encodeURIComponent(props.article.updatedAt)}` : null))
</script>

<template>
  <UCard class="group relative h-full transition hover:ring-primary/40 hover:shadow-md" :ui="{ root: 'flex flex-col overflow-hidden', header: 'p-0 sm:p-0', body: 'flex flex-1 flex-col gap-2' }">
    <template #header>
      <div class="aspect-[16/10] overflow-hidden bg-primary/10">
        <img v-if="cover" :src="cover" :alt="props.article.title" loading="lazy" class="size-full object-cover transition duration-500 group-hover:scale-105">
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
      <NuxtLink :to="localePath(`/news/${props.article.slug}`)" class="after:absolute after:inset-0">{{ props.article.title }}</NuxtLink>
    </h3>
    <p v-if="props.article.excerpt" class="line-clamp-3 text-sm text-muted">{{ props.article.excerpt }}</p>
    <span class="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
      {{ t('news.readMore') }}
      <UIcon name="i-lucide-arrow-right" class="size-4 transition group-hover:translate-x-0.5" />
    </span>
  </UCard>
</template>
