<script setup lang="ts">
import type { Result } from '~/api/v1/users'
import { users } from '~/api/v1/users'

const model = defineModel<Result['id']>()

const { params } = usePaginate()
const filter = ref<string | undefined>(model.value ? `id eq ${model.value}` : undefined)
const { data, status } = useAsyncData(
  useApi(() => users.getPage(params, undefined, filter.value)).fetcher,
  {
    watch: [params, filter],
  },
)

const options = ref<{ label: string, value: number }[]>([])

watch(data, (n) => {
  const newOptions = n?.results.map(i => ({ label: i.nickname ? `${i.nickname}(${i.username})` : i.username, value: i.id })) || []
  if (params.pageNo === 1) {
    options.value = newOptions
  }
  else if (newOptions) {
    options.value.push(...newOptions)
  }
})

function handleSearch(value: string) {
  if (value) {
    const clauses = [
      `username like %${value}%`,
      `nickname like %${value}%`,
      `email like %${value}%`,
    ]

    if (isNumber(value))
      clauses.push(`id eq ${value}`)
    filter.value = clauses.join(' or ')
  }
}
</script>

<template>
  <ASelect
    v-model="model"
    :loading="status === 'pending'"
    :options="options"
    :placeholder="$t('common.placeholderSelectItem', { item: $t('common.user') })"
    allow-clear
    allow-search
    @clear="() => {
      filter = undefined
      model = undefined
    }"
    @search="handleSearch"
    @dropdown-reach-bottom="() => {
      if (data?.pageCount) {
        if (params.pageNo < data.pageCount) {
          params.pageNo++
        }
      }
    }"
  />
</template>
