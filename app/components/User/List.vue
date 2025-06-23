<script setup lang="tsx">
import type { APIQuery } from '~/api/v1'
import type { APIGetUsersParams } from '~/api/v1/users'
import { TypographyText } from '@arco-design/web-vue'
import { useTableUtils } from '@yecaoi/arco'
import { getUsers } from '~/api/v1/users'
import IsActive from '~/components/UI/IsActive.vue'

const { t } = useI18n()

const query = reactive<APIQuery<APIGetUsersParams>>({})
const page = usePageParams()

const { data, refresh } = useAsyncData(() => getUsers({
  params: { query },
}), {
  watch: [query],
})

const columns = apiV1TableColumns<typeof getUsers>([
  {
    dataIndex: 'id',
    sortable: ['asc', 'desc'],
    width: 120,
    render: ({ record }) => h(TypographyText, { type: 'primary' }, () => record.id),
  },
  {
    dataIndex: 'uid',
    sortable: ['asc', 'desc'],
  },
  {
    dataIndex: 'email',
    width: 250,
  },
  {
    dataIndex: 'createdAt',
    sortable: ['asc', 'desc'],
    width: 250,
  },
  {
    dataIndex: 'updatedAt',
    sortable: ['asc', 'desc'],
    width: 250,
  },
  {
    dataIndex: 'isActive',
    render({ record }) {
      return <IsActive ok={record.isActive} />
    },
    width: 150,
  },
  {
    slotName: 'operations',
    title: t('common.operation', 2),
  },
])
const { resolveSlot, rowClass } = useTableUtils<Y<Y<typeof data.value>['data']>['results']>()

const onSorterChange = apiV1TableOnSorterChange(query)
</script>

<template>
  <ATable
    v-bind="page.arcoTable"
    :data="data?.data?.results"
    :columns="columns"
    row-key="id"
    :row-class="rowClass(({ row }) => `data-${row.id}`)"
    @sorter-change="onSorterChange"
  >
    <template #operations="value">
      <UserDelete :id="resolveSlot(value).row.id" @done="refresh()" />
    </template>
  </ATable>
</template>
