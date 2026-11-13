<script setup lang="ts">
const props = defineProps<{ content: string }>()
const blocks = computed(() => parseBlocks(props.content))
</script>

<template>
  <div class="space-y-4 leading-7 text-default">
    <template v-for="(b, i) in blocks" :key="i">
      <h2 v-if="b.type === 'heading'" class="pt-3 text-xl font-semibold tracking-tight text-highlighted">{{ b.text }}</h2>
      <p v-else-if="b.type === 'paragraph'">
        <template v-for="(line, j) in b.lines" :key="j"><br v-if="j > 0">{{ line }}</template>
      </p>
      <ul v-else class="space-y-1.5">
        <li v-for="(item, j) in b.items" :key="j" class="flex gap-2.5">
          <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-primary" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>
