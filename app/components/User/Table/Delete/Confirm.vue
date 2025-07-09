<script setup lang="ts">
import type { UserGetResponse } from '~/api/v1_1'

const props = defineProps<{ id: UserGetResponse['id'], uid: unknown, username: string }>()
const emit = defineEmits<{ success: [], failure: [], done: [] }>()

const { userDelete } = useApiV1Client()

const loading = ref(false)
async function onClick() {
  loading.value = true
  const { error } = await userDelete({ path: { user_id: props.id } })
  if (error) {
    emit('failure')
  }
  else {
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
