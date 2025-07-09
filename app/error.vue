<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

function reload() {
  location.reload()
}

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

console.error(props.error)
const { data } = useAsyncData(() => codeToHtml(
  JSON.stringify(props.error.data, undefined, 2),
  { lang: 'json', theme: color.value === 'light' ? 'dark-plus' : 'light-plus' },
))
</script>

<template>
  <div class="grid size-full place-content-center gap-4">
    <ATypographyTitle :heading="2">
      {{ $t('common.exception.label') }}
    </ATypographyTitle>

    <ATypographyTitle :heading="4">
      {{ $t('common.exception.code') }}
      <code>{{ error.statusCode }}</code>
    </ATypographyTitle>

    <section class="h-52 space-y-2 overflow-auto">
      <ATypographyText>
        {{ $t('common.exception.data') }}
      </ATypographyText>
      <div v-html="data" />
    </section>

    <ASpace>
      <AButton @click="reload">
        <template #icon>
          <IconRefresh />
        </template>
        {{ $t('common.reload') }}
      </AButton>

      <AButton class="ml-auto" @click="clearError({ redirect: '/' })">
        <template #icon>
          <IconHome />
        </template>
        {{ $t('common.goHome') }}
      </AButton>
    </ASpace>
  </div>
</template>

<style lang="postcss">
.shiki {
  @apply p-2 rounded md:w-[700px] font-mono;
}
</style>
