<script setup lang="ts">
const props = defineProps<{ label: string, field: string, icon?: string }>()
defineEmits<{ delete: [] }>()

const model = defineModel<string>()

const type = ref<
  'like' |
  'not_like' |
  'eq' |
  'ne' |
  'startWith' |
  'endWith'
>('like')

const value = ref()
const tmpValue = ref()

function escapePostgresLikeInput(input: string) {
  return input.replace(/[%_]/g, '\\$&') // 替换 % 和 _ 为转义后的字符
}

watch([value, type], ([nv, nt]) => {
  if (nv) {
    const v = escapePostgresLikeInput(nv)
    switch (nt) {
      case 'like':
      case 'not_like':
        model.value = `${props.field} ${nt} %${v}%`
        break
      case 'eq':
      case 'ne':
        model.value = `${props.field} ${nt} ${v}`
        break
      case 'startWith':
        model.value = `${props.field} like ${v}%`
        break
      case 'endWith':
        model.value = `${props.field} like %${v}`
        break
      default:
        model.value = `${props.field} like %${v}%`
        break
    }
  }
  else {
    value.value = undefined
    model.value = undefined
  }
})
</script>

<template>
  <UIFilterClauseItem
    :label="$props.label" :value="value" :icon="$props.icon ?? 'icon-textformat'"
    @close="() => { value = tmpValue }" @delete="$emit('delete')"
  >
    <template #operator>
      <a-select v-model="type" size="mini" default-value="contains" :style="{ width: '160px' }">
        <a-option value="like">
          {{ $t('common.filters.string.contains') }}
        </a-option>
        <a-option value="not_like">
          {{ $t('common.filters.string.notContains') }}
        </a-option>
        <a-option value="eq">
          {{ $t('common.filters.eq') }}
        </a-option>
        <a-option value="ne">
          {{ $t('common.filters.ne') }}
        </a-option>
        <a-option value="startWith">
          {{ $t('common.filters.string.startWith') }}
        </a-option>
        <a-option value="endWith">
          {{ $t('common.filters.string.endWith') }}
        </a-option>
      </a-select>
    </template>
    <template #input>
      <AInput v-model="tmpValue" :placeholder="$t('common.placeholderItem', { item: $props.label })" />
    </template>
  </UIFilterClauseItem>
</template>
