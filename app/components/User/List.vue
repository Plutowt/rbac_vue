<script setup lang="tsx">
import type { APIQuery } from '~/api/v1'
import type { APIGetUsersParams } from '~/api/v1/users'
import { useQuery } from '@tanstack/vue-query'
import { getUsers } from '~/api/v1/users'
import IsActive from '~/components/UI/IsActive.vue'

const query = reactive<APIQuery<APIGetUsersParams>>({})
const page = usePageParams()

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
  {
    dataIndex: 'email',
  },
  {
    dataIndex: 'createdAt',
    sortable: ['asc', 'desc'],
  },
  {
    dataIndex: 'updatedAt',
    sortable: ['asc', 'desc'],
  },
  {
    dataIndex: 'isActive',
    render({ record }) {
      return <IsActive ok={record.isActive}></IsActive>
    },
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
