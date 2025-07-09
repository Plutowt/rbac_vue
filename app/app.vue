<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { appName } from '~/constants'

useHead({ title: appName })

const color = useColorMode()
watch(() => color.value, (n) => {
  const k = 'arco-theme'
  if (n === 'dark') {
    document.body.setAttribute(k, 'dark')
  }
  else {
    document.body.removeAttribute(k)
  }
}, { immediate: true })

const i18n = useI18n()

const locale = computed(() => {
  switch (i18n.locale.value) {
    case 'zh':
      return zhCN
    case 'en':
      return enUS
    default:
      return zhCN
  }
})
</script>

<template>
  <NuxtLoadingIndicator />

  <a-config-provider :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
  <VueQueryDevtools />
</template>
