<script setup lang="tsx">
import type { UserRoleGetPageData } from '@/api/v1_1'
import { useTableUtils } from '@yecaoi/arco'
import IsActive from '~/components/UI/IsActive.vue'

const { t } = useI18n()

const { userRoleGetPage } = useApiV1Client()
const permissions = treePermissions()

type Result = APIPageResult<typeof userRoleGetPage>

const {
  visibleColumns,
  // toggleVisibleColumns,
  filterExpr,
} = useTypeTableColumns<typeof userRoleGetPage>([
  {
    dataIndex: 'id',
    minWidth: 120,
    sortable: ['asc', 'desc'],
    primary: true,
    filter: {
      type: 'number',
      column: true,
    },
  },
  {
    dataIndex: 'name',
    minWidth: 160,
    filter: {
      type: 'string',
      column: true,
    },
  },
  {
    dataIndex: 'enabled',
    title: t('common.status'),
    minWidth: 120,
    render: ({ record }) => <IsActive ok={record.enabled} />,
    filter: {
      type: 'select',
      selectProps: {
        options: [
          { label: t('common.enable'), value: true },
          { label: t('common.disable'), value: false },
        ],
        multiple: true,
      },
      column: true,
    },
  },
  {
    title: t('common.permission'),
    slotName: 'permissions',
    minWidth: 300,
    ellipsis: true,
    tooltip: true,
    filter: {
      field: 'permission',
      type: 'tree-select',
      treeSelectProps: {
        data: permissions,
        multiple: true,
      },
      column: true,
    },
  },
  {
    slotName: 'action',
    width: 55,
    title: null,
    fixed: 'right',
    defaultVisible: useHasAnyPermission('roles:update', 'roles:delete'),
  },
])

const query = reactive<Y<UserRoleGetPageData['query']>>({})
const { arcoTablePageAttrs, no, size, total } = usePageParams()
watchEffect(() => {
  query.pageNo = no.value
  query.pageSize = size.value
  query.filter = filterExpr.value
})

const { data, status, refresh } = useAsyncData(
  () => userRoleGetPage({ query }),
  { watch: [query], transform: getApiPageData },
)
watchEffect(() => {
  total.value = data.value?.count
})

const onSorterChange = useTypeTableOnSorterChange(query)
const selected = ref([])

const { resolveSlot: parseRow } = useTableUtils<Result>()

const actionObj = ref<Result>()
const actionVisible = reactive({ delete: false, update: false, setPermission: false })
const { sm } = useArcoBreakpoints()

const visibleCreate = ref(false)
</script>

<template>
  <UITableLayout>
    <template #header>
      <RoleTableRefresh :loading="status === 'pending'" @click="refresh()" />
      <PermissionCheckAny :pass="['roles:create']">
        <RoleTableCreate @click="visibleCreate = true" />

        <AModal
          v-model:visible="visibleCreate"
          :title="$t('common.createRole')"
          :footer="false"
        >
          <RoleTableCreateForm @success="refresh()" />
        </AModal>
      </PermissionCheckAny>

      <PermissionCheckAny :pass="['roles:delete']">
        <RoleTableDelete
          v-model="selected"
          @not-found="id => Notification.error({
            title: $t('common.deleteRoleFailure', { value: id }),
            content: $t('validation.notFound', { value: id }),
          })"
        />
      </PermissionCheckAny>

      <!-- <div class="ml-auto flex items-center">
        <UITableColumnToggle :columns="toggleVisibleColumns" />
      </div> -->
    </template>

    <ATable
      v-bind="arcoTablePageAttrs"
      v-model:selected-keys="selected"
      :bordered="{ cell: true }"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      :data="data?.results"
      :columns="visibleColumns"
      :loading="status === 'pending'"
      row-key="id"
      @sorter-change="onSorterChange"
    >
      <template #permissions="value">
        <AOverflowList>
          <ATag
            v-for="perm in parseRow(value).row.permissions" :key="perm.code"
            color="arcoblue"
          >
            {{ $t(`common.permissionCode.${perm.code}`) }}&nbsp;
          </ATag>
        </AOverflowList>
      </template>

      <template #action="value">
        <UITableAction @click="actionObj = value.record">
          <PermissionCheckAll :pass="['roles:update']">
            <RoleTableActionUpdate @click="actionVisible.update = true" />
            <RoleTableActionSetPermissions @click="actionVisible.setPermission = true" />
          </PermissionCheckAll>
          <UITableActionDivider />
          <PermissionCheckAll :pass="['roles:delete']">
            <RoleTableActionDelete @click="actionVisible.delete = true" />
          </PermissionCheckAll>
        </UITableAction>
      </template>
    </ATable>

    <template v-if="actionObj">
      <AModal
        v-model:visible="actionVisible.setPermission"
        :footer="false"
        :fullscreen="!sm"
        :title="$t('common.editRoleTitle', { value: actionObj.name })"
      >
        <RoleTableActionSetPermissionsForm
          :id="actionObj.id" :old="actionObj"
          @success="() => {
            Notification.success($t('common.editRoleSuccess'))
            actionVisible.update = false
            refresh()
          }"
        />
      </AModal>

      <AModal
        v-model:visible="actionVisible.update"
        :footer="false"
        :fullscreen="!sm"
        :title="$t('common.editRoleTitle', { value: actionObj.name })"
      >
        <RoleTableActionUpdateForm
          :id="actionObj.id" :old="actionObj"
          @success="() => {
            Notification.success($t('common.editRoleSuccess'))
            actionVisible.update = false
            refresh()
          }"
        />
      </AModal>

      <RoleTableActionDeleteConfirm
        :id="actionObj.id"
        v-model="actionVisible.delete"
        :name="actionObj.name"
        @success="refresh()"
      />
    </template>
  </UITableLayout>
</template>
