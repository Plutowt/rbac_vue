<script setup lang="ts">
import { trim } from 'es-toolkit'

defineProps<{
  filterValue: string[]
  setFilterValue: (filterValue: string[]) => void
  handleFilterConfirm: (event?: Event) => void
  handleFilterReset: (event?: Event) => void
  label?: string
}>()
defineEmits<{ reset: [value: any], confirm: [value: any] }>()
</script>

<template>
  <div class="rounded border border-[--color-neutral-3] bg-bg-5 p-5">
    <a-space direction="vertical">
      <a-input
        :model-value="filterValue[0]"
        :placeholder=" $props.label ? $t('common.placeholderItem', { item: $props.label }) : undefined"
        @input="(value) => setFilterValue([value])"
      />
      <div class="flex justify-end gap-3">
        <a-button
          @click="() => {
            $emit('reset', filterValue[0])
            $props.handleFilterReset()
          }"
        >
          <template #icon>
            <IconRefresh />
          </template>
          {{ $t('common.reset') }}
        </a-button>
        <a-button
          type="primary" @click="() => {
            let value = filterValue[0] || undefined
            if (value)
              value = trim(value)
            $emit('confirm', value)
            value ? handleFilterConfirm() : handleFilterReset()
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
