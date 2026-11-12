<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const current = computed(() => locales.value.find((l) => l.code === locale.value))

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:ring-brand-300"
      :aria-label="t('nav.language')"
      :aria-expanded="open"
      @click="open = !open"
    >
      <AppIcon name="globe" class="size-4" />
      <span class="uppercase">{{ current?.code }}</span>
      <AppIcon name="chevronDown" class="size-3.5 transition" :class="open && 'rotate-180'" />
    </button>
    <Transition enter-from-class="opacity-0 -translate-y-1" leave-to-class="opacity-0 -translate-y-1" enter-active-class="transition" leave-active-class="transition">
      <ul v-if="open" class="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200">
        <li v-for="l in locales" :key="l.code">
          <NuxtLink
            :to="switchLocalePath(l.code)"
            class="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-brand-50"
            :class="l.code === locale ? 'font-bold text-brand-800' : 'text-slate-700'"
            @click="open = false"
          >
            {{ l.name }}
            <span class="text-xs uppercase text-slate-400">{{ l.code }}</span>
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>
