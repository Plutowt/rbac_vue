<script setup lang="ts" generic="T extends Record<string, any>">
import type { FieldRule } from '@arco-design/web-vue'
import type { UIFormItemProps } from './types'
import { get, set } from 'es-toolkit/compat'
import parsePhoneNumber from 'libphonenumber-js/max'

const props = defineProps<UIFormItemProps<T>>()

const model = defineModel<T>()
const { t } = useI18n()
const rules = computed<FieldRule[]>(() => {
  const results: FieldRule[] = []
  if (props.rules) {
    if (Array.isArray(props.rules)) {
      results.push(...props.rules)
    }
    else {
      results.push(props.rules)
    }
  }

  if (props.required) {
    results.push({ required: true, message: t('validation.required') })
  }

  if (props.minLength !== undefined) {
    results.push({ minLength: props.minLength, message: t('validation.string.min', { value: props.minLength }) })
  }
  if (props.maxLength !== undefined) {
    results.push({ maxLength: props.maxLength, message: t('validation.string.max', { value: props.maxLength }) })
  }
  if (props.pattern !== undefined) {
    results.push({ match: props.pattern, message: t('validation.invalidFormat', { value: t(`common.${props.field}`) }) })
  }
  if (props.type === 'input-phonenumber') {
    results.push({ validator: (value, callback) => {
      if (value === undefined) {
        callback()
      }
      else if (parsePhoneNumber(value)?.isValid()) {
        callback()
      }
      else {
        callback(t('validation.invalidPhoneNumberFormat'))
      }
    } })
  }
  return results
})
const label = computed(() => props.label || (props.autoLabel ? t(`common.${props.field}`) : undefined))
const el = useTemplateRef('el')
</script>

<template>
  <AFormItem
    ref="el"
    :field="($props.field as string)"
    :label="label"
    :rules="rules"
    :hide-asterisk="$props.hideAsterisk"
    :disabled="$props.disabled"
    :extra="$props.extra"
  >
    <slot>
      <AInput
        v-if="$props.type === 'input'"
        :max-length="$props.maxLength"
        :model-value="field ? get(model, field) : visibleValue"
        :placeholder="$props.placeholder || ($props.autoLabel ? $t(`common.placeholderInput`, { value: $t(`common.${$props.field}`) }) : undefined)"
        @update:model-value="v => { model !== undefined && field && set(model, field, v) }"
      />
      <AInputPassword
        v-else-if="$props.type === 'input-password'"
        :max-length="$props.maxLength"
        :model-value="field ? get(model, field) : visibleValue"
        :placeholder="$props.placeholder || ($props.autoLabel ? $t(`common.placeholderInput`, { value: $t(`common.${$props.field}`) }) : undefined)"
        @update:model-value="(v: string) => { model !== undefined && field && set(model, field, v) }"
      />
      <UIInputPhoneNumber
        v-else-if="$props.type === 'input-phonenumber'"
        :model-value="field ? get(model, field) : visibleValue"
        :placeholder="$props.placeholder || ($props.autoLabel ? $t(`common.placeholderInput`, { value: $t(`common.${$props.field}`) }) : undefined)"
        :error="el?.isError"
        @update:model-value="v => {
          model !== undefined && field && set(model, field, v)
        }"
      />
      <ASwitch
        v-else-if="$props.type === 'switch'"
        :model-value="field ? get(model, field) : visibleValue"
        @update:model-value="v => { model !== undefined && field && set(model, field, v) }"
      />
      <ATextarea
        v-else-if="$props.type === 'textarea'"
        :max-length="$props.maxLength"
        :model-value="field ? get(model, field) : visibleValue"
        :placeholder="$props.placeholder || ($props.autoLabel ? $t(`common.placeholderInput`, { value: $t(`common.${$props.field}`) }) : undefined)"
        @update:model-value="v => { model !== undefined && field && set(model, field, v) }"
      />
    </slot>
  </AFormItem>
</template>
