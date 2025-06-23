<script setup lang="ts">
import { deleteUser } from '~/api/v1/users'

const props = defineProps<{ id?: any }>()
const emit = defineEmits<{ success: [], failure: [], done: [] }>()

const errorDetail = ref()

async function onClick() {
  if (props.id !== undefined) {
    const { error } = await deleteUser(props.id)
    errorDetail.value = error
    if (error) {
      emit('failure')
    }
    else {
      emit('success')
    }
    emit('done')
  }
}
</script>

<template>
  <UIDevPreview :data="errorDetail" />
  <AButton status="danger" @click="onClick">
    {{ $t('common.delete') }}
  </AButton>
</template>
