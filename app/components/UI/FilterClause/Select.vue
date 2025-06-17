<script setup lang="ts">
type Value = string | number | boolean | Record<string, any> | undefined
const props = defineProps<{
  label: string
  field: string
  icon?: string
  options?: { value: Value, label: string }[]
  loading?: boolean
  onClear?: () => void
  onSearch?: (value: string) => void
  onDropdownReachBottom?: () => void
}>()

defineEmits<{ close: [], delete: [], search: [value: string], clear: [], dropdownReachBottom: [] }>()

const model = defineModel<string>()

const value = ref<{ value: Value, label: string }[]>([])
const tmpValue = ref()

const type = ref<'eq' | 'ne'>('eq')

watch([value, type], ([nv, nt]) => {
  if (nv?.length && nt) {
    switch (nt) {
      case 'ne':
        model.value = `${props.field} not_in ${nv.map(i => i.value).join(' ')}`
        // model.value = `(${nv.map(i => `${props.field} ${nt} ${i.value}`).join(' and ')})`
        break

      default:
        model.value = `(${nv.map(i => `${props.field} ${nt} ${i.value}`).join(' or ')})`
        break
    }
  }
  else {
    model.value = undefined
  }
})
</script>

<template>
  <UIFilterClauseItem
    :label="$props.label" :value="value?.length ? value.map(i => i.label).join(', ') : undefined"
    :icon="$props.icon ?? 'icon-list_bullet'"
    @close="() => { value = tmpValue }" @delete="$emit('delete')"
  >
    <template #operator>
      <a-select v-model="type" size="mini" :style="{ width: '160px' }">
        <a-option value="eq">
          {{ $t('common.filters.string.contains') }}
        </a-option>
        <a-option value="ne">
          {{ $t('common.filters.string.notContains') }}
        </a-option>
      </a-select>
    </template>

    <template #input>
      <a-select
        v-model="tmpValue"
        :max-tag-count="3"
        :loading="$props.loading"
        :placeholder="$t('common.placeholderSelectItem', { item: $props.label })"
        multiple
        :allow-search="!!$props.onSearch"
        :allow-clear="!!$props.onClear"
        @search="v => $emit('search', v)"
        @clear="$emit('clear')"
        @dropdown-reach-bottom="$emit('dropdownReachBottom')"
      >
        <a-option v-for="(i, index) in $props.options" :key="index" :value="i">
          {{ i.label }}
        </a-option>
      </a-select>
    </template>
  </UIFilterClauseItem>
</template>
