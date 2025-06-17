<script setup lang="ts">
const props = defineProps<{ content: string, lang: 'bash' | 'json' }>()
const last = useLastChanged(() => props.content, { deep: true })
const color = useColorMode()
const { data } = useAsyncData(
  () => codeToHtml(
    props.content,
    {
      lang: props.lang,
      theme: color.value === 'light' ? 'light-plus' : 'dark-plus',
    },
  ),
  { watch: [last, () => color.value] },
)
</script>

<template>
  <a-scrollbar
    :style="color.value === 'light' ? 'background-color:#FFFFFF;color:#000000' : 'background-color:#1E1E1E;color:#D4D4D4'"
    style="overflow: auto;"
  >
    <div v-html="data" />
  </a-scrollbar>
</template>
