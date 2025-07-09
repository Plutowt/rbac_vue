<script setup lang="ts" generic="T extends Record<string, any>">
import type { ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import type { FetchError } from 'ofetch'
import type { Paths } from 'type-fest'
import type { UIFormProps } from './types'

interface SubmitFailedData { values: T, errors: Record<Paths<T>, ValidatedError> }

interface SubmitData { values: T, errors: Record<Paths<T>, ValidatedError> | undefined }

defineProps<UIFormProps<T>>()

defineEmits<{
  submitSuccess: [values: T]
  submitFailed: [data: SubmitFailedData]
  submitError: [error: FetchError]
  submit: [data: SubmitData]
}>()

const model = defineModel<T>()
const el = useTemplateRef('el')
function setField(field: Paths<T>, options: {
  message: string
  status?: ValidateStatus
}) {
  el.value?.setFields(Object.fromEntries([[field, options]]))
}
function setFields(options: { field: Paths<T>, options: { message: string, status?: ValidateStatus } }) {
  el.value?.setFields(options as Record<string, { message: string, status?: ValidateStatus }>)
}

defineExpose({ setField, setFields })
</script>

<template>
  <AForm
    ref="el"
    v-model="model"
    layout="vertical"
    @submit-success="v => $emit('submitSuccess', v as T)"
    @submit-failed="v => $emit('submitFailed', v as SubmitFailedData)"
    @submit="v => $emit('submit', v as SubmitData)"
  >
    <slot v-if="!$props.items" />

    <template v-else>
      <UIFormItem
        v-for="i in $props.items"
        :key="i.field"
        v-bind="i"
      >
        <slot :name="i.field" />
      </UIFormItem>
    </template>
  </AForm>
</template>
