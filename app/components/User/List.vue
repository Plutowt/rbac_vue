<script setup lang="ts">
import type { APIQuery } from '~/api/v1'
import type { APIGetUsersParams } from '~/api/v1/users'
import { useQuery } from '@tanstack/vue-query'
import { getUsers } from '~/api/v1/users'

// type Results = Exclude<Awaited<ReturnType<typeof apiV1['/users']['GET']>>['data'], undefined>['results']
const query = reactive<APIQuery<APIGetUsersParams>>({})
const page = usePageParams()
// Query
const { data } = useQuery({
  queryKey: ['users', query],
  queryFn: () => getUsers({
    params: { query },
  }),
})

const columns = apiV1TableColumns<typeof getUsers>([
  {
    dataIndex: 'id',
    sortable: ['asc', 'desc'],
  },
])

const onSorterChange = apiV1TableOnSorterChange(query)
</script>

<template>
  <UIDevPreview :data="query" />
  <ATable
    v-bind="page.arcoTable"
    :data="data?.data?.results"
    :columns="columns"
    @sorter-change="onSorterChange"
  />
</template>
