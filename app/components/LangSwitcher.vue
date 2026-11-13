<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

/** Same control as the Clinika staff app (LocaleSwitcher), but switching changes the URL (/ru, /en, /tr) for search engines. */
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed<DropdownMenuItem[]>(() =>
  locales.value.map((l) => ({
    label: l.name ?? l.code,
    type: 'checkbox' as const,
    checked: l.code === locale.value,
    onSelect: () => void navigateTo(switchLocalePath(l.code)),
  })),
)
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton color="neutral" variant="ghost" icon="i-lucide-languages" :label="locale.toUpperCase()" :aria-label="t('nav.language')" />
  </UDropdownMenu>
</template>
