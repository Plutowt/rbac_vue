<script setup lang="ts">
defineEmits<{ confirm: [Event], cancel: [Event] }>()
</script>

<template>
  <div class="w-52 border border-solid border-arco-border-3 bg-arco-bg-5 p-3 shadow-arco-1-center">
    <slot />

    <div class="mt-4 flex w-full items-center gap-3">
      <a-button
        size="mini"
        @click="e => $emit('cancel', e)"
      >
        <template #icon>
          <icon-refresh />
        </template>
        {{ $t('common.reset') }}
      </a-button>

      <a-button
        style="margin-left: auto;"
        type="primary" size="mini" @click="e => $emit('confirm', e)"
      >
        <template #icon>
          <icon-check />
        </template>
        {{ $t('common.confirm') }}
      </a-button>
    </div>
  </div>
</template>
