<script setup lang="ts">
import type { ArticleImage } from '#shared/types'

/** Article text; a "[rasm N]" line shows gallery picture N at that place (click: full screen). */
const props = defineProps<{ content: string; articleId?: string; images?: ArticleImage[] }>()
const emit = defineEmits<{ open: [index: number] }>()
const blocks = computed(() => parseBlocks(props.content))
const imageAt = (n: number) => props.images?.[n - 1]
</script>

<template>
  <div class="space-y-4 leading-7 text-default">
    <template v-for="(b, i) in blocks" :key="i">
      <h2 v-if="b.type === 'heading'" class="pt-3 text-xl font-semibold tracking-tight text-highlighted">{{ b.text }}</h2>
      <p v-else-if="b.type === 'paragraph'">
        <template v-for="(line, j) in b.lines" :key="j"><br v-if="j > 0">{{ line }}</template>
      </p>
      <figure v-else-if="b.type === 'image' && props.articleId && imageAt(b.n)" class="my-6 space-y-2">
        <button type="button" class="block w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted ring-1 ring-default" @click="emit('open', b.n - 1)">
          <img
            :src="imageUrl(props.articleId, imageAt(b.n)!.id)"
            :srcset="`${imageUrl(props.articleId, imageAt(b.n)!.id, true)} 640w, ${imageUrl(props.articleId, imageAt(b.n)!.id)} 2048w`"
            sizes="(min-width: 800px) 720px, 100vw"
            :width="imageAt(b.n)!.width"
            :height="imageAt(b.n)!.height"
            :alt="imageAt(b.n)!.caption"
            loading="lazy"
            class="h-auto w-full"
          >
        </button>
        <figcaption v-if="imageAt(b.n)!.caption" class="text-center text-sm text-muted">{{ imageAt(b.n)!.caption }}</figcaption>
      </figure>
      <ul v-else-if="b.type === 'list'" class="space-y-1.5">
        <li v-for="(item, j) in b.items" :key="j" class="flex gap-2.5">
          <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-primary" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>
