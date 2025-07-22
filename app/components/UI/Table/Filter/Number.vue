<script setup lang="ts">
const props = defineProps<{ field: string }>()
defineEmits<{ confirm: [string | null, Event], cancel: [Event] }>()

const expr = ref<string | null>(null)

// type Op = 'eq' | 'ne' | 'ge' | 'gt' | 'le' | 'lt' | 'between' | 'not_between' | 'is_null' | 'is_not_null'

const objs = defineModel<{ operator: string, value: unknown }[]>({ default: [{ operator: 'eq', value: undefined }] })

function isBinary(op: string) {
  return ['eq', 'ne', 'ge', 'gt', 'le', 'lt'].includes(op)
}

function isBetween(op: string) {
  return ['between', 'not_between'].includes(op)
}
watchEffect(() => {
  const result: string[] = []
  if (objs.value.length) {
    for (const obj of objs.value) {
      if (obj.operator) {
        if (isBinary(obj.operator)) {
          if (obj.value !== undefined)
            result.push(`${props.field} ${obj.operator} ${obj.value}`)
        }
        else if (['is_null', 'is_not_null'].includes(obj.operator)) {
          result.push(`${props.field} ${obj.operator}`)
        }
        else if (isBetween(obj.operator)) {
          if (obj.value === undefined) {
            obj.value = Array.from({ length: 2 })
          }
          else if (Array.isArray(obj.value)) {
            result.push(`${props.field} ${obj.operator} ${obj.value[0]} ${obj.value[1]}`)
          }
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
      objs = [{ operator: 'eq', value: undefined }]
      $emit('cancel', e)
    }"
    @confirm="(e) => $emit('confirm', expr, e)"
  >
    <template v-for="obj, index in objs" :key="index">
      <a-select
        :model-value="obj.operator"
        class="mb-2"
        size="mini"
        :options="[
          { label: $t('common.filterExpr.eq'), value: 'eq' },
          { label: $t('common.filterExpr.ne'), value: 'ne' },
          { label: $t('common.filterExpr.ge'), value: 'ge' },
          { label: $t('common.filterExpr.gt'), value: 'gt' },
          { label: $t('common.filterExpr.le'), value: 'le' },
          { label: $t('common.filterExpr.lt'), value: 'lt' },
          { label: $t('common.filterExpr.between'), value: 'between' },
          { label: $t('common.filterExpr.not_between'), value: 'not_between' },
          { label: $t('common.filterExpr.is_null'), value: 'is_null' },
          { label: $t('common.filterExpr.is_not_null'), value: 'is_not_null' },
        ]"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, operator: (v as string) } : o)
        }"
      />
      <a-input-number
        v-if="isBinary(obj.operator)"
        :model-value="(obj.value as number | undefined)"
        size="mini"
        @input="v => obj.value = v"
        @update:model-value="v => {
          objs = objs.map((o, i) => i === index ? { ...o, value: v } : o)
        }"
      >
        <template #prepend>
          <icon-search />
        </template>
      </a-input-number>
      <div v-else-if="isBetween(obj.operator)" class="space-y-2">
        <a-input-number
          :model-value="(obj.value as [number | undefined, number| undefined])?.[0]"
          size="mini"
          @input="v => {
            if (Array.isArray(objs[index]?.value)) {
              const values = objs[index].value
              objs = objs.map((o, i) => i === index ? { ...o, value: [v, values[1]] } : o)
            }
            else {
              objs = objs.map((o, i) => i === index ? { ...o, value: [v, undefined] } : o)
            }
          }"
        >
          <template #prepend>
            {{ $t('common.filterExpr.betweenStart') }}
          </template>
        </a-input-number>
        <a-input-number
          :model-value="(obj.value as [number | undefined, number| undefined])?.[1]"
          size="mini"
          @input="v => {
            if (Array.isArray(objs[index]?.value)) {
              const values = objs[index].value
              objs = objs.map((o, i) => i === index ? { ...o, value: [values[0], v] } : o)
            }
            else {
              objs = objs.map((o, i) => i === index ? { ...o, value: [undefined, v] } : o)
            }
          }"
        >
          <template #prepend>
            {{ $t('common.filterExpr.betweenEnd') }}
          </template>
        </a-input-number>
      </div>
    </template>
  </UITableFilterLayout>
</template>
