<script lang="ts" setup>
defineProps<{ text: string }>()
</script>

<template>
  <ATooltip :content="$props.text">
    <IconInfoCircle class="text-[--color-text-2]" />
  </ATooltip>
</template>
