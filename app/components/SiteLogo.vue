<script setup lang="ts">
const props = defineProps<{ name: string; hasLogo: boolean; light?: boolean }>()
/** Served by server/routes/media/logo.get.ts (proxied from the clinic API). */
const LOGO_URL = '/media/logo'
</script>

<template>
  <span class="flex min-w-0 items-center gap-3">
    <img v-if="props.hasLogo" :src="LOGO_URL" :alt="props.name" class="size-10 shrink-0 rounded-xl bg-white object-contain p-0.5 ring-1 ring-slate-200" width="40" height="40">
    <span v-else class="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-white shadow-md shadow-brand-700/30">
      <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z" /></svg>
    </span>
    <span class="truncate text-base font-extrabold tracking-tight sm:text-lg" :class="props.light ? 'text-white' : 'text-slate-900'">{{ props.name }}</span>
  </span>
</template>
