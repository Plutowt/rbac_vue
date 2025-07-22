<script setup lang="ts">
import type { ApiUserDetail } from '@/api/v1_1'
import { Notification } from '@arco-design/web-vue'
import { diff } from '@yecaoi/arco'

const props = defineProps<{ id: ApiUserDetail['id'], roles: string[] }>()
const emit = defineEmits<{
  cancel: []
  success: []
  failure: []
}>()
const { t } = useI18n()
const { userSetRoles } = useApiV1Client()
const loading = ref(false)
const { model, attrs } = useArcoForm<typeof userSetRoles>({
  default: [],
  onSubmitSuccess: async (values) => {
    if (!diff(values, props.roles) || loading.value)
      return

    loading.value = true

    const { error } = await userSetRoles({
      path: { user_id: props.id },
      body: values,
    })
    if (error) {
      if (error.code === 'NotFound') {
        Notification.error(t('validation.notFound', { value: t('common.resource') }))
      }
      emit('failure')
    }
    else {
      Notification.success(t('common.updateUserRoleSuccess'))
      emit('success')
    }

    loading.value = false
  },
})
</script>

<template>
  <AForm
    layout="vertical"
    v-bind="attrs"
  >
    <AFormItem :label="$t('common.id')" disabled>
      <AInput :default-value="$props.id.toString()" />
    </AFormItem>

    <UIFormItem :label="$t('common.roles')">
      <UIRoleSelect
        :model-value="((model.length ? model : $props.roles) as string[])"
        @update:model-value="values => {
          model.splice(0)
          values?.filter(i => i).forEach(i => {
            model.push(i)
          })
        }"
      />
    </UIFormItem>

    <div class="flex w-full items-center justify-end gap-4">
      <AButton @click="emit('cancel')">
        <template #icon>
          <IconClose />
        </template>
        {{ $t('common.cancel') }}
      </AButton>
      <AButton
        type="primary" status="warning" html-type="submit"
        :loading="loading" class="items-center"
      >
        <template #icon>
          <IconTool />
        </template>
        {{ $t('common.confirm') }}
      </AButton>
    </div>
  </AForm>
</template>
