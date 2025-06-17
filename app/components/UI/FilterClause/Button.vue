<script setup lang="ts">
defineProps<{ label: string, value?: any, icon?: string }>()
defineEmits<{ delete: [] }>()

const closeEl = useTemplateRef('closeEl')
const { isOutside } = useMouseInElement(closeEl)
</script>

<template>
  <AButton
    type="outline" shape="round" size="small"
    class="!px-2"
    :class="{
      '!border-border-2 !text-[rgb(var(--gray-8))]': $props.value === undefined,
      '!border-danger-6 !text-danger-6 ': !isOutside,
    }"
  >
    <template #icon>
      <slot name="icon">
        <UIIconFont :type="$props.icon ?? 'icon-target'" />
      </slot>
    </template>
    <div class="inline-flex items-center gap-2">
      <span>{{ $props.label }}<template v-if="$props.value !== undefined">:</template></span>
      <span>{{ $props.value }}</span>
      <button
        ref="closeEl"
        class="flex items-center rounded-full p-[2px]"
        @click="$emit('delete')"
      >
        <IconClose :size="10" />
      </button>
    </div>
  </AButton>
</template>
