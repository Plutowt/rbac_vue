<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="size-full flex-col bg-arco-fill-2">
    <APageHeader :title="$props.title" :show-back="false" />

    <div class="flex-1 px-6">
      <div class="rounded bg-arco-bg-2 p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
