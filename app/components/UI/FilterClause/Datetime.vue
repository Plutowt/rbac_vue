<script setup lang="ts">
const props = defineProps<{ label: string, field: string, icon?: string }>()
defineEmits<{ delete: [] }>()

const model = defineModel<string>()

const value = ref<string>()
const tmpValue = ref()
const type = ref<'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le'>('eq')

watchEffect(() => {
  if (value.value && type.value) {
    model.value = `${props.field} ${type.value} ${new Date(value.value).toISOString()}`
  }
  else {
    value.value = undefined
    model.value = undefined
  }
})
</script>

<template>
  <UIFilterClauseItem
    :label="$props.label" :value="value" :icon="$props.icon ?? 'icon-clock'"
    @close="value = tmpValue" @delete="$emit('delete')"
  >
    <template #operator>
      <a-select v-model="type" size="mini" :style="{ width: '160px' }">
        <a-option value="eq">
          {{ $t('common.filters.eq') }}
        </a-option>
        <a-option value="ne">
          {{ $t('common.filters.ne') }}
        </a-option>
        <a-option value="gt">
          {{ $t('common.filters.gt') }}
        </a-option>
        <a-option value="ge">
          {{ $t('common.filters.ge') }}
        </a-option>
        <a-option value="lt">
          {{ $t('common.filters.lt') }}
        </a-option>
        <a-option value="le">
          {{ $t('common.filters.le') }}
        </a-option>
      </a-select>
    </template>
    <template #input>
      <a-date-picker v-model="tmpValue" show-time />
    </template>
  </UIFilterClauseItem>
</template>
