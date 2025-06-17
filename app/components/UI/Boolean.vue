<script setup lang="ts">
defineProps<{ status?: boolean, label?: string, bordered?: boolean }>()
</script>

<template>
  <ATag :color="$props.status ? 'green' : 'red'" :bordered="$props.bordered">
    {{ $props.label }}
  </ATag>
</template>
