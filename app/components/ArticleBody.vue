<script setup lang="ts">
const props = defineProps<{ content: string }>()
const blocks = computed(() => parseBlocks(props.content))
</script>

<template>
  <div class="space-y-5 text-[1.0625rem] leading-8 text-slate-700">
    <template v-for="(b, i) in blocks" :key="i">
      <h2 v-if="b.type === 'heading'" class="pt-4 text-2xl font-extrabold tracking-tight text-slate-900">{{ b.text }}</h2>
      <p v-else-if="b.type === 'paragraph'">
        <template v-for="(line, j) in b.lines" :key="j"><br v-if="j > 0">{{ line }}</template>
      </p>
      <ul v-else class="space-y-2 pl-1">
        <li v-for="(item, j) in b.items" :key="j" class="flex gap-3">
          <span class="mt-3 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>
