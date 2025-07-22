<script setup lang="ts">
import type { SelectProps } from '@arco-design/web-vue'

const props = defineProps<{ field: string, selectProps: SelectProps }>()
defineEmits<{ confirm: [string | null, Event], cancel: [Event] }>()

const expr = ref<string | null>(null)

// type Op = 'in' | 'not_in' | 'is_null' | 'is_not_null'

const objs = defineModel<{ operator: string, value: unknown | unknown[] }[]>({ default: [{ operator: 'in', value: [] }] })

function isIn(op: string) {
  return ['in', 'not_in'].includes(op)
}

watchEffect(() => {
  const result: string[] = []
  if (objs.value.length) {
    for (const obj of objs.value) {
      if (obj.operator) {
        if (isIn(obj.operator)) {
          if (Array.isArray(obj.value)) {
            if (obj.value.length)
              result.push(`${props.field} ${obj.operator} ${obj.value.join(' ')}`)
          }
          else if (obj.value) {
            result.push(`${props.field} ${obj.operator} ${obj.value}`)
          }
        }
        else if (['is_null', 'is_not_null'].includes(obj.operator)) {
          result.push(`${props.field} ${obj.operator}`)
        }
      }
    }
  }

  if (result.length) {
    expr.value = result.join(' and ')
  }
  else {
    expr.value = null
  }
})
</script>

<template>
  <UITableFilterLayout
    @cancel="(e) => {
      objs = [{ operator: 'in', value: [] }]
      $emit('cancel', e)
    }"
    @confirm="e => $emit('confirm', expr, e)"
  >
    <template v-for="obj, index in objs" :key="index">
      <a-select
        :model-value="obj.operator"
        class="mb-2"
        size="mini"
        :options="[
          { label: $t('common.filterExpr.in'), value: 'in' },
          { label: $t('common.filterExpr.not_in'), value: 'not_in' },
          { label: $t('common.filterExpr.is_null'), value: 'is_null' },
          { label: $t('common.filterExpr.is_not_null'), value: 'is_not_null' },
        ]"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, operator: (v as string) } : o)
        }"
      />
      <a-select
        v-if="isIn(obj.operator)"
        :model-value="(obj.value as string | number | string[] | number[] | undefined)"
        size="mini"
        v-bind="Object.entries($props.selectProps).map(([k, v]) => ({ [k]: toValue(v) })).reduce((a, b) => ({ ...a, ...b }), {})"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, value: v } : o)
        }"
      />
    </template>
  </UITableFilterLayout>
</template>
