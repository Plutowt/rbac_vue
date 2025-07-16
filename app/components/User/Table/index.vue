<script setup lang="tsx">
import type { GetArgument } from '@yecaoi/arco'
import type { APIResult } from '~/api/v1'
import { Button, Form, FormItem, Input, Notification } from '@arco-design/web-vue'
import { useTableUtils } from '@yecaoi/arco'
import IsActive from '~/components/UI/IsActive.vue'

const { d, t } = useI18n()

const { userGetPage } = useApiV1Client()
const query = reactive<Y<GetArgument<typeof userGetPage, 0>['query']>>({})
const { arcoTablePageAttrs, no, size, total } = usePageParams()
watchEffect(() => {
  query.pageNo = no.value
  query.pageSize = size.value
})
const { data, refresh, status } = useAsyncData(
  () => userGetPage({ query }),
  { watch: [query, no, size] },
)
type Results = Y<Y<typeof data.value>['data']>['results']
watchEffect(() => {
  total.value = data.value?.data?.count
})

const { visibleColumns, toggleVisibleColumns } = apiV1TableColumns<Results>([
  {
    dataIndex: 'id',
    minWidth: 120,
    slotName: 'id',
    fixed: 'left',

    filterable: {
      filter(_filteredValue, _record) {
        return true
      },
      renderContent: (data) => {
        const { attrs } = useArcoForm<typeof query>({
          onSubmitSuccess: (_, ev) => {
            data.handleFilterConfirm(ev)
          },
        })

        return (
          <Form
            model={attrs.model}
            onSubmitSuccess={attrs.onSubmitSuccess}
            class="p-5 bg-arco-bg-5 border border-solid border-arco-border-3 shadow-arco-1-center"
          >
            <FormItem field="id">
              <Input
                modelValue={data.filterValue[0]}
                onUpdate:modelValue={v => data.setFilterValue([v])}
              />
            </FormItem>
            <div class="flex items-center">
              <Button htmlType="button">{t('common.reset')}</Button>
              <Button htmlType="submit" type="primary">{t('common.confirm')}</Button>
            </div>
          </Form>
        )
      },
    },
    sortable: ['asc', 'desc'],
  },
  {
    dataIndex: 'uid',
    minWidth: 400,
    sortable: ['asc', 'desc'],
    enableToggleVisible: true,
    defaultVisible: false,
  },
  {
    minWidth: 160,
    dataIndex: 'username',
    enableToggleVisible: true,
  },
  {
    minWidth: 160,
    dataIndex: 'email',
    // width: 250,
    enableToggleVisible: true,
  },
  {
    dataIndex: 'locale',
    width: 120,
    enableToggleVisible: true,
    defaultVisible: false,
  },
  {
    minWidth: 250,
    dataIndex: 'createdAt',
    // width: 250,
    sortable: ['asc', 'desc'],
    render: ({ record }) => d(record.createdAt, 'long'),
    enableToggleVisible: true,
  },
  {
    minWidth: 250,
    dataIndex: 'updatedAt',
    // width: 250,
    sortable: ['asc', 'desc'],
    render: ({ record }) => record.updatedAt && d(record.updatedAt, 'long'),
    enableToggleVisible: true,
    defaultVisible: false,
  },
  {
    dataIndex: 'isActive',
    width: 120,
    render({ record }) {
      return <IsActive ok={record.isActive} />
    },
  },
  {
    width: 55,
    slotName: 'operations',
    title: null,
    fixed: 'right',
  },
])
const onSorterChange = apiV1TableOnSorterChange(query)

const { resolveSlot, rowClass } = useTableUtils<Results>()

const operation = ref<APIResult<Results>>()
watchEffect(() => {
  const results = data.value?.data?.results
  if (results && operation.value) {
    operation.value = results.find(i => i.id === operation.value?.id)
  }
})

const visibleDeleteConfirm = ref(false)
const auth = useAuth()
const visibleUpdateModal = ref(false)
const visibleChangePasswordModal = ref(false)
const { sm } = useArcoBreakpoints()

const selected = ref([])
</script>

<template>
  <div class="space-y-4">
    <div class="flex">
      <UserCreate v-permissions="['users:create']" />

      <div class="ml-auto flex items-center">
        <UITableColumnToggle :columns="toggleVisibleColumns" />
      </div>
    </div>

    <ATable
      v-bind="arcoTablePageAttrs"
      v-model:selected-keys="selected"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      :bordered="{ cell: true }"
      :data="data?.data?.results"
      :columns="visibleColumns"
      :loading="status === 'pending'"
      row-key="id"
      :row-class="rowClass(({ row }) => `data-${row.id}`)"
      @sorter-change="onSorterChange"
    >
      <template #id="value">
        <ATypographyText type="primary">
          {{ resolveSlot(value).row.id }}
        </ATypographyText>
      </template>

      <template #operations="value">
        <UITableOperation @click="operation = resolveSlot(value).row">
          <template v-if="operation">
            <UserTableUpdateToggleIsActive
              :id="operation.id"
              v-permissions="['users:update', 'users']"
              :is-active="operation.isActive"
              :disabled="auth.info?.uid === operation.uid"
              @success="refresh()"
            />
            <UserTableUpdatePassword v-permissions="['users:update', 'users']" @click="visibleChangePasswordModal = true" />
            <UserTableUpdate v-permissions="['users:update', 'users']" @click="visibleUpdateModal = true" />
            <UserTableDelete v-permissions="['users:delete', 'users']" @click="visibleDeleteConfirm = true" />
          </template>
        </UITableOperation>
      </template>
    </ATable>

    <AModal
      v-if="operation"
      v-model:visible="visibleChangePasswordModal"
      :footer="false"
      :fullscreen="!sm"
      :title="$t('common.editUserTitle', { value: operation.username })"
    >
      <UserTableUpdatePasswordForm
        :id="operation.id"
        :old="operation"
        @success="() => {
          Notification.success($t('common.changeUserPasswordSuccess', { value: operation?.username }))
          visibleChangePasswordModal = false
          refresh()
        }"
      />
    </AModal>

    <AModal
      v-if="operation"
      v-model:visible="visibleUpdateModal"
      :footer="false"
      :fullscreen="!sm"
      :title="$t('common.editUserTitle', { value: operation.username })"
    >
      <UserTableUpdateForm
        :id="operation.id"
        :old="operation"
        @success="() => {
          Notification.success($t('common.updateUserSuccess', { value: operation?.username }))
          visibleUpdateModal = false
          refresh()
        }"
      />
    </AModal>

    <UserTableDeleteConfirm
      v-if="operation"
      :id="operation.id"
      v-model="visibleDeleteConfirm"
      :uid="operation.uid"
      :username="operation.username"
      @success="() => {
        Notification.success($t('common.deleteUserSuccess', { value: operation?.username }))
        refresh()
      }"
    />
  </div>
</template>
