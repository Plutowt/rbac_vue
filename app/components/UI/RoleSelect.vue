<script setup lang="ts">
import type { SelectOption } from '@arco-design/web-vue'

const { userRoleGetPage } = useApiV1Client()
const { no, nextPage, max, total } = usePageParams({ size: 20 })

const options = ref<SelectOption[]>([])
const { data, status } = useAsyncData(
  () => userRoleGetPage({ query: { pageNo: no.value } }),
  {
    watch: [no],
    transform: (v) => {
      const results = v.data?.results.map(i => ({
        label: i.name,
        value: i.name,
        disabled: !i.enabled,
      })) satisfies SelectOption[] | undefined

      return { ...v.data, results }
    },
  },
)

const model = defineModel<string[]>()
watchEffect(() => {
  const value = data.value
  max.value = value?.pageCount
  total.value = value?.count
  if (value?.results) {
    if (no.value === 1) {
      options.value = value.results
    }
    else {
      options.value.push(...value.results)
    }
  }
})
</script>

<template>
  <UIDevPreview :data="{ count: options.length }" />
  <ASelect
    v-model="model"
    :options="options"
    multiple
    :loading="status === 'pending'"
    @dropdown-reach-bottom="() => {
      console.log('触发');

      nextPage()
    }"
  />
</template>
