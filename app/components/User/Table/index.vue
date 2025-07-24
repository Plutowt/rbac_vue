<script setup lang="tsx">
import type { UserGetPageData } from '@/api/v1_1'
import { Notification, Tag } from '@arco-design/web-vue'
import { useTableUtils } from '@yecaoi/arco'
import IsActive from '~/components/UI/IsActive.vue'

const { t, d } = useI18n()

const { userGetPage } = useApiV1Client()

const {
  visibleColumns,
  toggleVisibleColumns,
  filterExpr: filterExprValue,
} = useTypeTableColumns<typeof userGetPage>([
  {
    dataIndex: 'id',
    minWidth: 120,
    slotName: 'id',
    fixed: 'left',
    filter: {
      type: 'number',
      column: true,
    },
    sortable: ['asc', 'desc'],
    primary: true,
  },
  {
    dataIndex: 'uid',
    minWidth: 400,
    // sortable: ['asc', 'desc'],
    enableToggleVisible: true,
    defaultVisible: false,
    filter: {
      type: 'uuid',
      column: true,
    },
  },
  {
    minWidth: 160,
    dataIndex: 'username',
    enableToggleVisible: true,
    filter: {
      type: 'string',
      column: true,
    },
  },
  {
    dataIndex: 'isActive',
    width: 120,
    filter: {
      type: 'select',
      selectProps: {
        options: [
          { label: t('common.enable'), value: true },
          { label: t('common.disable'), value: false },
        ],
      },
      column: true,
    },
    render: ({ record }) => <IsActive ok={record.isActive} />,
  },
  {
    minWidth: 160,
    dataIndex: 'email',
    // width: 250,
    enableToggleVisible: true,
    filter: {
      type: 'string',
      column: true,
    },
  },
  {
    dataIndex: 'roles',
    minWidth: 160,
    render: data => <div class="flex gap-2">{data.record.roles.map((i, idx) => <Tag key={idx}>{i.name}</Tag>)}</div>,
    title: t('common.role'),
    filter: {
      field: 'roleName',
      type: 'string',
      column: true,

    },
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
    filter: {
      type: 'datetime',
      column: true,
    },
  },
  {
    minWidth: 250,
    dataIndex: 'updatedAt',
    // width: 250,
    render: ({ record }) => record.updatedAt && d(record.updatedAt, 'long'),
    enableToggleVisible: true,
    defaultVisible: false,
    sortable: ['asc', 'desc'],
    filter: {
      type: 'datetime',
      column: true,
    },
  },
  {
    width: 55,
    slotName: 'action',
    title: null,
    fixed: 'right',
    defaultVisible: useHasAnyPermission('users:update', 'users:delete'),
  },
])

const query = reactive<Y<UserGetPageData['query']>>({})
const { arcoTablePageAttrs, no, size, total } = usePageParams()
watchEffect(() => {
  query.pageNo = no.value
  query.pageSize = size.value
  query.filter = filterExprValue.value
})
const { data, refresh, status } = useAsyncData(
  () => userGetPage({ query }),
  { watch: [query, no, size], transform: getApiPageData },
)

watchEffect(() => {
  total.value = data.value?.count
})

const onSorterChange = useTypeTableOnSorterChange(query)
const { resolveSlot } = useTableUtils<APIPageResult<typeof data>>()

const actionObj = ref<APIPageResult<typeof data>>()
watchEffect(() => {
  const results = data.value?.results
  if (results && actionObj.value) {
    actionObj.value = results.find(i => i.id === actionObj.value?.id)
  }
})

const auth = useAuth()
const actionVisible = reactive({
  update: false,
  changePassword: false,
  setRoles: false,
  delete: false,
})
const { sm } = useArcoBreakpoints()

const selected = ref([])

const tableLoading = ref(false)
watchEffect(() => {
  tableLoading.value = status.value === 'pending'
})

const visibleCreate = ref(false)
</script>

<template>
  <UITableLayout>
    <template #header>
      <UserTableRefresh @click="refresh()" />
      <PermissionCheckAny :pass="['users:create']">
        <UserTableCreate @click="visibleCreate = true" />
        <AModal
          v-model:visible="visibleCreate"
          :title="$t('common.createUser')"
          :footer="false"
        >
          <UserTableCreateForm @success="refresh()" />
        </AModal>
      </PermissionCheckAny>
      <PermissionCheckAny :pass="['users:delete']">
        <UserTableDelete
          v-model="selected"
          v-model:loading="tableLoading"
          @not-found="id => Notification.error({
            title: $t('common.deleteUserFailure', { value: id }),
            content: $t('validation.notFound', { value: id }),
          })"
          @done="refresh()"
        />
      </PermissionCheckAny>

      <div class="ml-auto flex items-center">
        <UITableColumnToggle :columns="toggleVisibleColumns" />
      </div>
    </template>

    <ATable
      v-bind="arcoTablePageAttrs"
      v-model:selected-keys="selected"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      :bordered="{ cell: true }"
      :data="data?.results"
      :columns="visibleColumns"
      :loading="tableLoading"
      row-key="id"
      @sorter-change="onSorterChange"
    >
      <template #action="value">
        <UITableAction @click="actionObj = resolveSlot(value).row">
          <template v-if="actionObj">
            <PermissionCheckAll :pass="['users:update']">
              <UserTableActionUpdateToggleIsActive
                :id="actionObj.id"
                :is-active="actionObj.isActive"
                :disabled="auth.info?.uid === actionObj.uid"
                @success="refresh()"
              />
              <UserTableActionUpdatePassword @click="actionVisible.changePassword = true" />
              <UserTableActionUpdate @click="actionVisible.update = true" />
              <PermissionCheckAll :pass="['roles:read']">
                <UserTableActionUpdateRoles @click="actionVisible.setRoles = true" />
              </PermissionCheckAll>
            </PermissionCheckAll>
            <UITableActionDivider />
            <PermissionCheckAll :pass="['users:delete']">
              <UserTableActionDelete @click="actionVisible.delete = true" />
            </PermissionCheckAll>
          </template>
        </UITableAction>
      </template>
    </ATable>

    <template v-if="actionObj">
      <AModal
        v-model:visible="actionVisible.changePassword"
        :footer="false"
        :fullscreen="!sm"
        :title="$t('common.changePassword')"
      >
        <UserTableActionUpdatePasswordForm
          :id="actionObj.id"
          :old="actionObj"
          @success="() => {
            Notification.success($t('common.changeUserPasswordSuccess', { value: actionObj?.username }))
            actionVisible.changePassword = false
            refresh()
          }"
          @cancel="actionVisible.changePassword = false"
        />
      </AModal>

      <AModal
        v-model:visible="actionVisible.update"
        :footer="false"
        :fullscreen="!sm"
        :title="$t('common.editUserTitle', { value: actionObj.username })"
      >
        <UserTableActionUpdateForm
          :id="actionObj.id"
          :old="actionObj"
          @success="() => {
            Notification.success($t('common.updateUserSuccess', { value: actionObj?.username }))
            actionVisible.update = false
            refresh()
          }"
        />
      </AModal>

      <PermissionCheckAll :pass="['roles:read']">
        <AModal
          v-model:visible="actionVisible.setRoles"
          :footer="false"
          :fullscreen="!sm"
          :title="$t('common.setUserRoles')"
        >
          <UserTableActionUpdateRolesForm
            :id="actionObj.id"
            :roles="actionObj.roles.map(i => i.name)"
            @cancel="actionVisible.setRoles = false"
            @success="() => {
              actionVisible.setRoles = false
              refresh()
            }"
          />
        </AModal>
      </PermissionCheckAll>

      <UserTableActionDeleteConfirm
        :id="actionObj.id"
        v-model="actionVisible.delete"
        v-model:loading="tableLoading"
        :uid="actionObj.uid"
        :username="actionObj.username"
        @success="refresh()"
      />
    </template>
  </UITableLayout>
</template>
