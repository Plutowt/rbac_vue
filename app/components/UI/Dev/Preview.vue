<script setup lang="ts">
const props = defineProps<{ data: unknown }>()
const last = useLastChanged(() => props.data, { deep: true })
const color = useColorMode()
const { data } = useAsyncData(
  () => codeToHtml(
    JSON.stringify(props.data, null, 2),
    {
      lang: 'json',
      theme: color.value === 'light' ? 'light-plus' : 'dark-plus',
    },
  ),
  { watch: [last, () => color.value] },
)

const el = useTemplateRef<HTMLElement>('el')

const parentEl = useParentElement()

const initialValue = computed(() => ({ x: parentEl.value?.scrollLeft, y: parentEl.value?.scrollTop }) as { x: number, y: number })

const { style } = useDraggable(el, {
  initialValue,
})
</script>

<template>
  <DevOnly>
    <div
      ref="el"
      class="
        z-[9999999] rounded border border-gray-500 shadow
        dark:shadow-white
      " :style="style" style="position: fixed"
    >
      <div v-html="data" />
    </div>
  </DevOnly>
</template>
