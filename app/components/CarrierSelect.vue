<script setup lang="ts">
import { api } from '~/api/v1/carriers'

const { data, status } = useAsyncData(
  useApi(() => api.getAll()).fetcher,
  {
    transform: (v) => {
      let index = 0
      return v?.map(i => ({ index: index++, label: i.name, value: i.name, ...i }))
    },
  },
)
const options = ref()
watch(data, (n) => {
  options.value = n
})
const model = defineModel<string | undefined>({ required: true })
function handleSearch(value: string) {
  options.value = data.value?.filter(i => i.name.includes(value))
}
</script>

<template>
  <ASelect
    v-model="model"
    :loading="status === 'pending'"
    :options="options"
    :placeholder="$t('common.placeholderSelectItem', { item: $t('common.carrier') })"
    allow-clear
    allow-search
    @clear="() => {
      model = undefined
    }"
    @search="handleSearch"
  />
</template>
