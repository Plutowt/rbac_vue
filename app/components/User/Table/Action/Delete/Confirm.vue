<script setup lang="ts">
import type { UserGetResponse } from '~/api/v1_1'
import { Notification } from '@arco-design/web-vue'

const props = defineProps<{ id: UserGetResponse['id'], uid: unknown, username: string }>()
const emit = defineEmits<{ success: [], failure: [], done: [] }>()

const { userDelete } = useApiV1Client()
const { t } = useI18n()

const loading = defineModel('loading', { default: false })

async function onClick() {
  if (loading.value)
    return

  loading.value = true
  const { error } = await userDelete({ path: { user_id: props.id } })
  if (error) {
    switch (error.code) {
      case 'NotFound':
        Notification.error({
          title: t('common.deleteUserFailure', { value: props.username }),
          content: t('validation.notFound', { value: props.id }),
        })
        break

      default:
        break
    }
    emit('failure')
  }
  else {
    Notification.success(t('common.deleteUserSuccess', { value: props.username }))
    emit('success')
  }
  emit('done')
  loading.value = false
}
const visibleConfirm = defineModel<boolean>()
const auth = useAuth()
</script>

<template>
  <AModal
    v-model:visible="visibleConfirm"
    :ok-button-props="{ status: 'danger' }"
    :ok-loading="loading"
    :title="$props.uid === auth.info?.uid ? $t('glossary.deleteCurrentUserTitle') : $t('common.dangerOperation')"
    message-type="error"
    simple
    draggable
    @ok="onClick"
  >
    {{ $props.uid === auth.info?.uid ? $t('glossary.deleteCurrentUser') : $t('glossary.deleteUser', { value: $props.username }) }}
  </AModal>
</template>
