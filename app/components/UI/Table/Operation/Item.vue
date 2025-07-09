<script setup lang="ts">
defineProps<{
  loading?: boolean
  danger?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="flex gap-2 px-4 py-2.5"
    :class="[
      $props.disabled
        ? 'cursor-not-allowed text-neutral-500'
        : $props.loading
          ? `
            cursor-not-allowed
            ${$props.danger ? 'text-arco-danger-2' : 'text-neutral-500'}
          `
          : `
            cursor-pointer
            ${$props.danger ? 'text-arco-danger-6' : `
              text-neutral-700
              dark:text-arco-text-1
            `}
            hover:bg-arco-fill-2
          `,
    ]"
  >
    <IconLoading v-if="$props.loading" spin />
    <slot v-else name="icon" />
    <slot />
  </button>
</template>
