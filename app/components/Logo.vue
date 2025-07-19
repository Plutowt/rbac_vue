<script setup>
import { appName } from '@/constants'
</script>

<template>
  <NuxtLinkLocale to="index" class="flex items-center gap-2">
    <NuxtImg width="32" src="/image/logo.svg" />
    <span
      class="
        text-2xl font-semibold tracking-wider text-neutral-800
        dark:text-neutral-50
      "
    >{{ appName }}</span>
  </NuxtLinkLocale>
</template>
