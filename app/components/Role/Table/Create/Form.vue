<script setup lang="ts">
import { Notification } from '@arco-design/web-vue'

const emit = defineEmits<{ success: [], failure: [] }>()

const { t } = useI18n()
const { userRoleCreate } = useApiV1Client()
const { model, attrs, setField, reset } = useArcoForm<typeof userRoleCreate>({
  onSubmitSuccess: async (values) => {
    const { error } = await userRoleCreate({
      body: values,
    })
    if (error) {
      switch (error.code) {
        case 'Conflict':
          setField(error.target, {
            message: t('validation.conflictItem', { value: t(`common.${error.target}`) }),
            status: 'error',
          })
          break

        default:
          break
      }
      emit('failure')
    }
    else {
      Notification.success(t('common.createRoleSuccess'))
      emit('success')
    }
  },
})
const permissions = treePermissions()
</script>

<template>
  <AForm layout="vertical" v-bind="attrs">
    <UIDevPreview :data="model" />

    <UIFormItem
      v-model="model"
      field="name"
      auto-label
      type="input"
      :min-length="2"
      :max-length="128"
      required
      hide-asterisk
    />

    <UIFormItem
      v-model="model"
      field="description"
      auto-label
      type="textarea"
      :max-length="1024"
    />

    <AFormItem
      :label="$t('common.permission')"
      field="permissions"
      hide-asterisk
      :rules="[{ required: true, message: $t('validation.required') }]"
    >
      <ATreeSelect
        v-model="model.permissions"
        multiple
        :data="permissions"
        tree-checkable
        tree-checked-strategy="parent"
      />
    </AFormItem>

    <div class="flex w-full items-center justify-end gap-4">
      <AButton @click="reset">
        <template #icon>
          <IconRefresh />
        </template>
        {{ $t('common.reset') }}
      </AButton>
      <AButton type="primary" html-type="submit">
        <template #icon>
          <IconPlus />
        </template>
        {{ $t('common.create') }}
      </AButton>
    </div>
  </AForm>
</template>
