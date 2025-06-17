<script setup lang="ts">
defineProps<{
  filterValue: (number | undefined)[]
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
      <slot>
        <AInputNumber
          :model-value="$props.filterValue[0]"
          :placeholder="$t('common.placeholderItem', { item: $props.label })"
          @input="v => { $props.filterValue[0] = v }"
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
            const value = filterValue[0]
            $emit('confirm', value)
            value !== undefined ? handleFilterConfirm() : handleFilterReset()
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
