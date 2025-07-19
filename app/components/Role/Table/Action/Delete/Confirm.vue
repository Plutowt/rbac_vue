<script setup lang="ts">
import type { UserRoleGetDetailResponse } from '~/api/v1_1'
import { Notification } from '@arco-design/web-vue'

const props = defineProps<{ id: UserRoleGetDetailResponse['id'], name: string }>()
const emit = defineEmits<{ success: [], failure: [], done: [] }>()

const { userRoleDelete } = useApiV1Client()
const { t } = useI18n()

const loading = ref(false)
async function onClick() {
  loading.value = true
  const { error } = await userRoleDelete({ path: { role_id: props.id } })
  if (error) {
    switch (error.code) {
      case 'NotFound':
        Notification.error({
          title: t('common.deleteRoleFailure', { value: props.name }),
          content: t('validation.notFound', { value: props.id }),
        })
        break

      default:
        break
    }
    emit('failure')
  }
  else {
    Notification.success(t('common.deleteRoleSuccess', { value: props.name }))
    emit('success')
  }
  emit('done')
  loading.value = false
}
const visibleConfirm = defineModel<boolean>()
</script>

<template>
  <AModal
    v-model:visible="visibleConfirm"
    :ok-button-props="{ status: 'danger' }"
    :ok-loading="loading"
    :title="$t('common.dangerOperation')"
    message-type="error"
    simple
    draggable
    @ok="onClick"
  >
    {{ $t('common.deleteUserRoleConfirm', { value: $props.name }) }}
  </AModal>
</template>
