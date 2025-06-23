<script setup lang="ts">
defineProps<{ ok: boolean }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="size-2 rounded-full" :class="[$props.ok ? 'bg-green-400' : 'bg-red-400']" />
    {{ $props.ok ? $t('common.isEnabled') : $t('common.isDisabled') }}
  </div>
</template>
