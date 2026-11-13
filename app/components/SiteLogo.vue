<script setup lang="ts">
/** Same mark as the Clinika staff app (AppLogo): logo from Settings, otherwise the hospital icon on a teal tile. */
const props = defineProps<{ name: string; hasLogo: boolean; inverted?: boolean }>()
const LOGO_URL = '/media/logo'
</script>

<template>
  <span class="flex min-w-0 items-center gap-2.5">
    <span class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-inverted shadow-sm">
      <img v-if="props.hasLogo" :src="LOGO_URL" :alt="props.name" class="size-full object-cover" width="36" height="36">
      <UIcon v-else name="i-lucide-hospital" class="size-5" />
    </span>
    <span class="truncate text-base font-semibold" :class="props.inverted ? 'text-white' : 'text-highlighted'">{{ props.name }}</span>
  </span>
</template>
