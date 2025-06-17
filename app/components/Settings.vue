<script setup lang="ts">
const display = defineModel<boolean>()
</script>

<template>
  <AButton
    size="small" shape="circle" type="outline" class="!border-border-2 !text-[rgb(var(--gray-8))]"
    @click="display = !display"
  >
    <template #icon>
      <IconSettings />
    </template>
  </AButton>

  <AModal v-model:visible="display">
    2
  </AModal>
</template>
