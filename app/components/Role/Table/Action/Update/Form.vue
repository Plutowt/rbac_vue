<script setup lang="ts">
import type { ApiRoleResult } from '~/api/v1_1'
import { diff } from '@yecaoi/arco'

const props = defineProps<{ old: ApiRoleResult | undefined, id: ApiRoleResult['id'] }>()
const emit = defineEmits<{ success: [], failure: [] }>()

const { t } = useI18n()

const { userRoleUpdate } = useApiV1Client()

const loading = ref(false)

const { model, attrs, setField } = useArcoForm<typeof userRoleUpdate>({
  default: {
    name: props.old?.name,
    description: props.old?.description,
  },
  onSubmitSuccess: async (values) => {
    const body = diff(values, props.old) as typeof values
    if (!body)
      return
    loading.value = true
    const { error } = await userRoleUpdate({ body, path: { role_id: props.id } })

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
      emit('success')
    }
    loading.value = false
  },
})
</script>

<template>
  <AForm layout="vertical" :disabled="loading" v-bind="attrs">
    <UIDevPreview :data="model" />

    <UIFormItem
      :model-value="{ id: $props.id.toString() }"
      field="id"
      disabled
      auto-label
      type="input"
    />

    <UIFormItem
      v-model="model"
      field="name"
      auto-label
      type="input"
      :min-length="2"
      :max-length="128"
    />

    <UIFormItem
      v-model="model"
      field="description"
      auto-label
      type="textarea"
      :max-length="1024"
    />

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
