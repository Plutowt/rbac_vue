<script setup>
import { appName } from '@/constants'
</script>

<template>
  <ACard
    class="
      p-3
      sm:p-6
    "
  >
    <ASpace size="large" direction="vertical" fill>
      <ATypographyTitle :heading="4">
        {{ appName }}
      </ATypographyTitle>

      <slot />
    </ASpace>

    <div
      class="flex w-full items-center gap-2"
    >
      <slot name="footer" />
      <div class="ml-auto" />
      <LanguageToggle />
      <ColorModeToggle />
    </div>
  </ACard>
</template>
