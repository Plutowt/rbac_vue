<script setup lang="ts">
defineProps<{ loading: boolean }>()
</script>

<template>
  <AButton :loading="$props.loading">
    <template #icon>
      <IconRefresh />
    </template>
    {{ $t('common.refresh') }}
  </AButton>
</template>
