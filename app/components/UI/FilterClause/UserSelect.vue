<script setup lang="ts">
import { users } from '~/api/v1/users'

defineProps<{
  field: string
}>()

defineEmits<{ close: [], delete: [] }>()

const model = defineModel<string>()

const { params } = usePaginate()
const filter = ref<string | undefined>()
const { data, status } = useAsyncData(
  'get-users',
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
  <UIFilterClauseSelect
    v-model="model"
    :field="$props.field"
    :loading="status === 'pending'"
    :options="options"
    :label="$t('common.user')"
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
    @close="$emit('close')"
    @delete="$emit('delete')"
  />
</template>
