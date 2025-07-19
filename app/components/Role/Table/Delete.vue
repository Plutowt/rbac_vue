<script setup lang="ts">
const emit = defineEmits<{ notFound: [ID], done: [] }>()

type ID = GetFirstArgument<typeof userRoleDelete>['path']['role_id']

const { userRoleDelete } = useApiV1Client()

const values = defineModel<ID[]>()
async function hdlr() {
  for (const id of (values.value || [])) {
    const { error } = await userRoleDelete({ path: { role_id: id } })
    if (error?.code === 'NotFound') {
      emit('notFound', id)
    }
  }

  values.value = []
  emit('done')
}

const visible = ref(false)
</script>

<template>
  <AButton status="danger" type="primary" @click="visible = !!values?.length">
    <template #icon>
      <IconDelete />
    </template>

    {{ $t('common.deleteRole') }}
  </AButton>

  <AModal
    v-model:visible="visible"
    :title="$t('common.deleteRolesTitle', { value: values?.length })"
    :ok-button-props="{
      status: 'danger',
    }"
    :ok-text="$t('common.deleteRole')"
    @ok="hdlr"
  >
    {{ $t('common.deleteRolesConfirm') }}
  </AModal>
</template>
