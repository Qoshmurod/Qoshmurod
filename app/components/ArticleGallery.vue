<script setup lang="ts">
import type { ArticleImage } from '#shared/types'

/** Pictures not placed in the text, as a grid of previews (click: full screen at that picture). */
const props = defineProps<{ articleId: string; images: ArticleImage[]; skip: Set<number> }>()
const emit = defineEmits<{ open: [index: number] }>()
const { t } = useI18n()
const shown = computed(() => props.images.map((img, i) => ({ img, i })).filter(({ i }) => !props.skip.has(i + 1)))
</script>

<template>
  <section v-if="shown.length" class="space-y-3" :aria-label="t('gallery.title')">
    <h2 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
      <UIcon name="i-lucide-images" class="size-5 text-primary" />
      {{ t('gallery.title') }}
      <span class="text-sm font-normal text-muted tabular-nums">{{ shown.length }}</span>
    </h2>
    <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
      <li v-for="{ img, i } in shown" :key="img.id" :class="shown.length === 1 && 'col-span-2 sm:col-span-3'">
        <button
          type="button"
          class="group block w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted ring-1 ring-default focus-visible:outline-2 focus-visible:outline-primary"
          :class="shown.length === 1 ? '' : 'aspect-square'"
          :aria-label="img.caption || t('gallery.picture', { n: i + 1 })"
          @click="emit('open', i)"
        >
          <img
            :src="imageUrl(props.articleId, img.id, shown.length > 1)"
            :alt="img.caption"
            :width="img.width"
            :height="img.height"
            loading="lazy"
            class="size-full object-cover transition duration-300 group-hover:scale-105"
            :class="shown.length === 1 && 'h-auto'"
          >
        </button>
      </li>
    </ul>
  </section>
</template>
