<script setup lang="ts">
const { t } = useI18n()

const IconDesktop = resolveComponent('icon-desktop')
const IconSun = resolveComponent('icon-sun')
const IconMoon = resolveComponent('icon-moon')

// 'system' 是 Nuxt 支持的特殊值, 该值会获取当前系统的主题色
type NuxtThemeMode = 'system' | 'light' | 'dark'
interface Item { value: NuxtThemeMode, label: string, click: () => void, icon: any }

const colors = computed<Item[]>(() => [
  { value: 'system', label: t('common.theme.auto'), click: toggleMode('system'), icon: IconDesktop },
  { value: 'light', label: t('common.theme.light'), click: toggleMode('light'), icon: IconSun },
  { value: 'dark', label: t('common.theme.dark'), click: toggleMode('dark'), icon: IconMoon },
])
const color = useColorMode()

function toggleMode(mode: NuxtThemeMode) {
  return () => {
    color.preference = mode
  }
}

const current = computed(() => {
  return colors.value.find(i => i.value === color.preference)!
})
</script>

<template>
  <ADropdown @select="i => { (i as Item).click() }">
    <AButton
      size="small" shape="circle" type="outline" class="
        !border-arco-border-2 !text-[rgb(var(--gray-8))]
      "
    >
      <template #icon>
        <IconDesktop v-if="current.value === 'system'" />
        <IconSun v-else-if="current.value === 'light'" />
        <IconMoon v-else-if="current.value === 'dark'" />
      </template>
    </AButton>

    <template #content>
      <ADoption v-for="i in colors" :key="i.value" :value="i">
        <div
          class="flex items-center gap-2"
        >
          <component :is="i.icon" class="text-lg" /> {{ i.label }}
        </div>
      </ADoption>
    </template>
  </ADropdown>
</template>
