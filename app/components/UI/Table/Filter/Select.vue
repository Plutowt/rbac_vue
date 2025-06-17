<script setup lang="ts">
import type { SelectProps } from '@arco-design/web-vue'

defineProps<SelectProps & {
  filterValue: string[]
  setFilterValue: (filterValue: string[]) => void
  handleFilterConfirm: (event?: Event) => void
  handleFilterReset: (event?: Event) => void
  label?: string
  options?: { label: string, value: any }[]
  onDropdownReachBottom?: ((ev: Event) => any) | undefined
  onSearch?: ((inputValue: string) => any)
}>()
defineEmits<{
  reset: [value: any]
  confirm: [value: any]
}>()
</script>

<template>
  <div class="rounded border border-[--color-neutral-3] bg-bg-5 p-5">
    <a-space direction="vertical">
      <slot>
        <!-- options {{ $props.options }} -->
        <ASelect
          v-model="$props.filterValue[0]"
          :placeholder=" $props.label ? $t('common.placeholderSelectItem', { item: $props.label }) : undefined"
          :options="$props.options"
          :multiple="$props.multiple"
          :loading="$props.loading"
          @search="$props.onSearch"
          @dropdown-reach-bottom="$props.onDropdownReachBottom"
        />
      </slot>

      <div class="flex justify-end gap-3">
        <a-button
          @click="() => {
            $emit('reset', filterValue[0])
            handleFilterReset()
          }"
        >
          <template #icon>
            <IconRefresh />
          </template>
          {{ $t('common.reset') }}
        </a-button>
        <a-button
          type="primary" @click="() => {
            const value = filterValue[0] as unknown
            $emit('confirm', value)
            if (value !== undefined) handleFilterConfirm()
            else handleFilterReset()
          }"
        >
          <template #icon>
            <IconCheck />
          </template>
          {{ $t('common.confirm') }}
        </a-button>
      </div>
    </a-space>
  </div>
</template>
