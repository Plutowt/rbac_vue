<script setup lang="ts">
defineEmits<{ click: [] }>()
const active = ref()
</script>

<template>
  <ATrigger
    trigger="click" :popup-translate="[0, 10]" position="br"
    @show="active = true"
    @hide="active = false"
  >
    <AButton
      size="mini" type="text"
      :class="[active ? '!bg-arco-primary-1' : '!text-arco-text-2']"
      @click="$emit('click')"
    >
      <template #icon>
        <IconMoreVertical />
      </template>
    </AButton>
    <template #content>
      <div class="flex w-48 flex-col rounded-sm border border-arco-border-2 bg-arco-bg-5">
        <slot />
      </div>
    </template>
  </ATrigger>
</template>
