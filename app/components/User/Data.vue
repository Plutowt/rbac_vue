<script setup lang="tsx">
import type { components } from '~/api/v1'
import type { PageFilterRules, Result, UserUpdate } from '~/api/v1/users'
import { users } from '~/api/v1/users'

const { t, d } = useI18n()

const displayFilters = ref(false)

const { params: pageParams, arcoTableAttrs } = usePaginate()
const filterRules = reactive<PageFilterRules>({})
const {
  columns,
  column,
  sorts,
  sortOptions,
  filter,
  filters,
  filterOptions,
} = useColumns<Result>(
  [
    {
      title: 'ID',
      hidden: true,
      dataIndex: 'id',
      type: 'number',
    },
    {
      title: t('common.username'),
      slotName: 'username',
      fixed: 'left',
      dataIndex: 'username',
      type: 'string',
      filterable: true,
      onFilterReset() {
        delete filterRules.username
      },
      onFilterConfirm(value) {
        filterRules.username = value
      },
    },
    {
      title: t('common.nickname'),
      dataIndex: 'nickname',
      slotName: 'nickname',
      ellipsis: true,
      tooltip: true,
      type: 'string',
      filterable: true,
      onFilterReset() {
        delete filterRules.nickname
      },
      onFilterConfirm(value) {
        filterRules.nickname = value
      },
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      slotName: 'email',
      ellipsis: true,
      tooltip: true,
      type: 'string',
      filterable: true,
      onFilterReset() {
        delete filterRules.email
      },
      onFilterConfirm(value) {
        filterRules.email = value
      },
      width: 220,
    },
    {
      title: t('common.role'),
      slotName: 'role',
      dataIndex: 'role',
      type: 'select',
      options: [
        { label: t('common.roles.admin'), value: 'admin' },
        { label: t('common.roles.agent'), value: 'agent' },
        { label: t('common.roles.user'), value: 'user' },
      ],
      filterable: true,
      onFilterReset() {
        delete filterRules.role
      },
      onFilterConfirm(value) {
        filterRules.role = value
      },
    },
    {
      title: t('common.status.label'),
      slotName: 'status',
      dataIndex: 'disabled',
      type: 'select',
      options: [
        { label: t('common.enable'), value: false },
        { label: t('common.disable'), value: true },
      ],
      filterable: true,
      onFilterReset() {
        delete filterRules.disabled
      },
      onFilterConfirm(value) {
        filterRules.disabled = value
      },
    },
    {
      title: t('common.createdAt'),
      render: ({ record }) => d(record.createdAt, 'long'),
      dataIndex: 'createdAt',
      type: 'datetime',
    },
    {
      title: t('common.updatedAt'),
      render: ({ record }) => record.updatedAt && d(record.updatedAt, 'long'),
      dataIndex: 'updatedAt',
      type: 'datetime',
    },
    {
      title: t('common.operations'),
      slotName: 'operations',
      fixed: 'right',
      minWidth: 500,
    },
  ],
)
watch(
  [sorts, filterRules, filter, () => pageParams.pageSize],
  () => { pageParams.pageNo = 1 },
)

const { data, status, refresh } = useAsyncData(
  useApi(() => users.getPage(pageParams, filterRules, filter.value, sorts)).fetcher,
  {
    watch: [
      pageParams,
      filterRules,
      filter,
      sorts,
    ],
  },
)

const { currentEdit, editData, editing, submitEdit, submitEditStatus } = useEditData<Result, UserUpdate>(
  async (data) => {
    await users.update(currentEdit.value!.id, data)
    refresh()
  },
  {
    key: 'id',
    item: current => `${t('common.user')} ${current.id}(${current.username}) `,
  },
)

const editPassword = ref<Result>()
const editingPassword = ref(false)
const { model, attrs: changePasswordAttrs, el: changePasswordEl } = useFormUtils<components['schemas']['AdminUserUpdate']>({
  onSubmitSuccess: async (values) => {
    await useApiV1(
      `/users/${editPassword.value?.id}` as '/users/{user_id}',
      { method: 'patch', body: { ...toRaw(values) } },
    )({
      onSuccess: () => {
        Message.success(
          t('common.action.itemStatus', {
            action: t('common.update'),
            item: t('common.user'),
            status: t('common.status.success'),
          }),
        )
        editingPassword.value = false
        refresh()
      },
    })
    // await useApi(() => api.update(editPassword.value.id, { password: values.password })).fetcher()
  },
})
watch(editPassword, () => {
  changePasswordEl.value?.resetFields()
})
</script>

<template>
  <ASpace fill direction="vertical" size="medium">
    <div>
      <div class="flex items-center">
        <ASpace>
          <AButton type="primary" @click="$lp('/users/add')">
            <template #icon>
              <icon-plus />
            </template>{{ $t('common.add') }}
          </AButton>

          <AButton @click="refresh()">
            <template #icon>
              <IconRefresh />
            </template>
            {{ $t('common.refresh') }}
          </AButton>
        </ASpace>

        <ASpace class="ml-auto">
          <ATrigger trigger="click" :popup-translate="[0, 10]" show-arrow>
            <AButton shape="circle">
              <template #icon>
                <UIIconFont type="icon-rectangle_split_x" />
              </template>
            </AButton>
            <template #content>
              <div class="c-arrow w-48 rounded border border-fill-3 bg-bg-5 py-1">
                <ul>
                  <li
                    v-for="(i, index) in column.options.value"
                    :key="index"
                  >
                    <button
                      class="flex w-full items-center gap-3 px-3 py-2 text-left text-[--color-text-1] hover:bg-fill-2"
                      @click="column.toggle(i)"
                    >
                      <IconCheck v-if="column.enabled(i)" />
                      {{ i.title }}
                    </button>
                  </li>
                </ul>
              </div>
            </template>
          </ATrigger>

          <AButton
            :type="displayFilters ? 'primary' : undefined" shape="circle"
            @click="displayFilters = !displayFilters"
          >
            <template #icon>
              <IconFilter />
            </template>
          </AButton>

          <UISorts v-model="sorts" :items="sortOptions" />
        </ASpace>
      </div>

      <ADivider class="!my-0" />

      <UIFilterClauses v-if="displayFilters" v-model="filters" :options="filterOptions" />
    </div>

    <ATable
      :columns="columns" :data="data?.results" :loading="status === 'pending' || submitEditStatus === 'pending'"
      :bordered="{ cell: true }"
      scrollbar :scroll="{ x: 1000 }"
      v-bind="arcoTableAttrs(data)"
    >
      <template #username="{ record }: { record: Result }">
        <AInput v-if="editing(record)" v-model="editData.username" />
        <template v-else>
          <a-typography-text copyable>
            {{ record.username }}
          </a-typography-text>
        </template>
      </template>

      <template #nickname="{ record }: { record: Result }">
        <AInput v-if="editing(record)" v-model="editData.nickname" />
        <template v-else>
          <a-typography-text>
            {{ record.nickname }}
          </a-typography-text>
        </template>
      </template>

      <template #email="{ record }: { record: Result }">
        <AInput v-if="editing(record)" v-model="editData.email" />
        <template v-else>
          <a-typography-text copyable>
            {{ record.email }}
          </a-typography-text>
        </template>
      </template>

      <template #status="{ record }: { record: Result }">
        <ASwitch
          :model-value="editing(record) ? !editData.disabled : !record.disabled"
          :disabled="currentEdit?.id !== record.id"
          @update:model-value="nv => {
            if (editing(record))
              editData.disabled = !nv
          }"
        />
      </template>

      <template #role="{ record }: { record: Result }">
        <ASelect v-if="editing(record)" v-model="editData.role">
          <a-option value="admin">
            {{ $t('common.roles.admin') }}
          </a-option>
          <a-option value="user">
            {{ $t('common.roles.user') }}
          </a-option>
        </ASelect>
        <UserRoleTag v-else :role="record.role" />
      </template>

      <template #operations="{ record }: { record: Result }">
        <div class="flex items-center gap-2">
          <UIButton
            type="edit" size="small" @click="() => {
              editingPassword = true
              editPassword = record
            }"
          >
            {{ $t('common.changePassword') }}
          </UIButton>
          <AModal v-model:visible="editingPassword" @ok="e => changePasswordEl?.handleSubmit(e)">
            <AForm v-bind="changePasswordAttrs">
              <AFormItem field="password" :label="$t('common.newPassword')">
                <AInputPassword v-model="model.password" :placeholder="$t('common.placeholderItem', { item: $t('common.newPassword') })" />
              </AFormItem>
            </AForm>
          </AModal>
          <template v-if="editing(record)">
            <UIButton size="small" type="cancel" @click="currentEdit = undefined" />
            <UIButton size="small" type="confirm" :loading="submitEditStatus === 'pending'" @click="submitEdit" />
          </template>
          <template v-else>
            <UIButton
              size="small" type="edit"
              @click="currentEdit = record"
            />
            <UIButton
              type="delete"
              size="small"
              @click="useApi(
                () => users.delete(record.id),
                {
                  onSuccess: () => {
                    Message.success($t('common.action.itemStatus', { action: $t('common.delete'), item: `${$t('common.user')} ${record.id}(${record.username}) `, status: $t('common.status.success') }))
                    refresh()
                  },
                },
              ).fetcher"
            >
              {{ $t('common.confirmAction', { action: $t('common.action.item', { action: $t('common.delete'), item: `${$t('common.user')} ${record.id}(${record.username}) ` }) }) }}
            </UIButton>
          </template>
        </div>
      </template>
    </ATable>
  </ASpace>
</template>
