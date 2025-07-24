<script setup lang="ts">
import type { SelectOption } from '@arco-design/web-vue'

const { userRoleGetPage } = useApiV1Client()
const { no, nextPage, total } = usePageParams({ size: 20 })

const options = ref<SelectOption[]>([])

const query = reactive<ApiV1SearchParams<typeof userRoleGetPage>>({})
const roleName = ref('')
watchEffect(() => {
  query.pageNo = no.value
  query.filter = roleName.value ? `name contains ${roleName.value}` : undefined
})
const { data, status } = useAsyncData(
  () => userRoleGetPage({ query }),
  {
    watch: [query],
    transform: (v) => {
      const results = v?.data?.results.map(i => ({
        label: i.name,
        value: i.name,
        disabled: !i.enabled,
      })) satisfies SelectOption[] | undefined

      return { ...v?.data, results }
    },
  },
)

const model = defineModel<string[]>()
watchEffect(() => {
  const value = data.value
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

function onSearch(v: string) {
  roleName.value = v
}
</script>

<template>
  <ASelect
    v-model="model"
    :options="options"
    multiple
    :loading="status === 'pending'"
    allow-search
    @search="onSearch"
    @dropdown-reach-bottom="nextPage"
  />
</template>
