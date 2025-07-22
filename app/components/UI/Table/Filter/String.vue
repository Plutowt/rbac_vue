<script setup lang="ts">
const props = defineProps<{ field: string }>()
defineEmits<{ confirm: [string | null, Event], cancel: [Event] }>()
const expr = ref<string | null>(null)

// type Op = 'startswith' | 'endswith' | 'contains' | 'is_null' | 'is_not_null' | 'blank' | 'not_blank'

const objs = defineModel<{ operator: string, value: unknown }[]>({ default: [{ operator: 'eq', value: undefined }] })

function isBinary(op: string) {
  return ['startswith', 'endswith', 'contains', 'eq', 'ne'].includes(op)
}

watchEffect(() => {
  const result: string[] = []
  if (objs.value.length) {
    for (let index = 0; index < objs.value.length; index++) {
      const obj = objs.value[index]
      if (obj) {
        if (isBinary(obj.operator)) {
          // 处理空字符串
          if (!obj.value)
            obj.value = undefined
          else
            result.push(`${props.field} ${obj.operator} ${obj.value}`)
        }
        else if (['is_null', 'is_not_null', 'blank', 'not_blank'].includes(obj.operator)) {
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
    @cancel="(e) => { $emit('cancel', e) }"
    @confirm="e => $emit('confirm', expr, e)"
  >
    <template
      v-for="obj, index in objs" :key="index"
    >
      <a-select
        :model-value="obj.operator"
        size="mini"
        class="mb-2"
        :options="[
          { label: $t('common.filterExpr.eq'), value: 'eq' },
          { label: $t('common.filterExpr.ne'), value: 'ne' },
          { label: $t('common.filterExpr.startswith'), value: 'startswith' },
          { label: $t('common.filterExpr.endswith'), value: 'endswith' },
          { label: $t('common.filterExpr.contains'), value: 'contains' },
          { label: $t('common.filterExpr.blank'), value: 'blank' },
          { label: $t('common.filterExpr.not_blank'), value: 'not_blank' },
          { label: $t('common.filterExpr.is_null'), value: 'is_null' },
          { label: $t('common.filterExpr.is_not_null'), value: 'is_not_null' },
        ]"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, operator: (v as string) } : o)
        }"
      />
      <a-input
        v-if="isBinary(obj.operator)"
        :model-value="(obj.value as string | undefined)"
        size="mini"
        @input="v => obj.value = v"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, value: v } : o)
        }"
      >
        <template #prepend>
          <icon-search />
        </template>
      </a-input>
    </template>
  </UITableFilterLayout>
</template>
