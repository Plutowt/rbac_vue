<script setup lang="ts">
defineProps<{ label: string, value: unknown, icon?: string }>()
defineEmits<{ close: [], delete: [] }>()
const display = ref(false)
</script>

<template>
  <a-popover
    v-model:popup-visible="display" position="bottom" trigger="click"
    @popup-visible-change="n => {
      if (!n) $emit('close')
    }"
  >
    <UIFilterClauseButton :label="$props.label" :value="$props.value" :icon="$props.icon" @delete="$emit('delete')" />
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <span>{{ $props.label }}</span>
          <slot name="operator" />
          <AButton
            size="mini" shape="circle"
            @click="() => {
              display = false
              $emit('close')
            }"
          >
            <template #icon>
              <icon-close />
            </template>
          </AButton>
        </div>

        <slot name="input" />
      </div>
    </template>
  </a-popover>
</template>
