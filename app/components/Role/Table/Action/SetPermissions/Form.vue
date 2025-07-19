<script setup lang="ts">
import type { ApiRoleResult } from '~/api/v1_1'
import { diff } from '@yecaoi/arco'

const props = defineProps<{ old: ApiRoleResult | undefined, id: ApiRoleResult['id'] }>()
const emit = defineEmits<{ success: [], failure: [] }>()

const { userRoleSetPermissions } = useApiV1Client()

const loading = ref(false)

const { model, attrs } = useArcoForm<typeof userRoleSetPermissions>({
  default: props.old?.permissions.map(i => i.code) || [],
  onSubmitSuccess: async (values) => {
    const isChanged = diff(values, props.old) as typeof values
    if (!isChanged)
      return
    loading.value = true

    const { error } = await userRoleSetPermissions({ body: values, path: { role_id: props.id } })

    if (error) {
      emit('failure')
    }
    else {
      emit('success')
    }
    loading.value = false
  },
})
const options = treePermissions()
const data = ref(props.old?.permissions.map(i => i.code) || [])
watch(data, (n) => {
  model.splice(0)
  model.push(...n)
})
</script>

<template>
  <AForm layout="vertical" :disabled="loading" v-bind="attrs">
    <UIFormItem
      :model-value="{ id: $props.id.toString() }"
      field="id"
      disabled
      auto-label
      type="input"
    />

    <UIFormItem
      :label="$t('common.permission')"
      required
    >
      <ATreeSelect
        v-model="data"
        multiple
        :data="options"
        tree-checkable
        tree-checked-strategy="parent"
      />
    </UIFormItem>

    <div class="flex w-full items-center justify-end gap-4">
      <AButton>
        <template #icon>
          <IconRefresh />
        </template>
        {{ $t('common.reset') }}
      </AButton>
      <AButton
        type="primary" status="warning" html-type="submit"
        :loading="loading"
      >
        <template #icon>
          <IconPen />
        </template>
        {{ $t('common.update') }}
      </AButton>
    </div>
  </AForm>
</template>
