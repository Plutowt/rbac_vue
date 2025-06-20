<script setup lang="ts">
defineProps<{ ok: boolean }>()
</script>

<template>
  <ATag :color="$props.ok ? 'green' : 'red'" />
</template>
