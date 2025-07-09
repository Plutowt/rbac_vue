<script setup lang="ts">
import type { UserUpdateData } from '~/api/v1_1'

const props = defineProps<{
  id: UserUpdateData['path']['user_id']
  isActive: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ success: [], failure: [], done: [] }>()

const { userUpdate } = useApiV1Client()

const loading = ref(false)
async function onClick() {
  if (props.disabled)
    return

  loading.value = true
  const { error } = await userUpdate({ body: { isActive: !props.isActive }, path: { user_id: props.id } })
  if (error) {
    emit('failure')
  }
  else {
    emit('success')
  }
  emit('done')
  loading.value = false
}
</script>

<template>
  <UITableOperationItem
    :loading="loading" :disabled="$props.disabled" @click="onClick"
  >
    {{ $t(`common.${$props.isActive ? 'disable' : "enable"}User`) }}
  </UITableOperationItem>
</template>
