<script setup lang="ts">
const emit = defineEmits<{ notFound: [ID], done: [] }>()

type ID = GetFirstArgument<typeof userDelete>['path']['user_id']

const { userDelete } = useApiV1Client()

const values = defineModel<ID[]>()
const loading = defineModel<boolean>('loading', { default: false })

async function hdlr() {
  if (loading.value)
    return

  loading.value = true
  for (const id of (values.value || [])) {
    const { error } = await userDelete({ path: { user_id: id } })
    if (error?.code === 'NotFound') {
      emit('notFound', id)
    }
  }

  values.value = []
  loading.value = false
  emit('done')
}

const visible = ref(false)
</script>

<template>
  <AButton status="danger" type="primary" @click="visible = !!values?.length">
    <template #icon>
      <IconDelete />
    </template>

    {{ $t('common.deleteUser') }}
  </AButton>

  <AModal
    v-model:visible="visible"
    :title="$t('common.deleteUserTitle', { value: values?.length })"
    :ok-button-props="{
      status: 'danger',
    }"
    :ok-text="$t('common.deleteUser')"
    @ok="hdlr"
  >
    {{ $t('common.deleteUserDescription') }}
  </AModal>
</template>
