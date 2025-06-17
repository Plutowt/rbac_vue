<script setup lang="ts">
import { layoutHeaderHeight } from '~/constants'
</script>

<template>
  <a-layout-header
    class="flex items-center border-b border-b-[--color-border] bg-bg-1 px-5"
    :style="{ height: `${layoutHeaderHeight}px` }"
  >
    <Logo />

    <div class="ml-auto">
      <ASpace size="medium">
        <LanguageToggle />
        <ColorModeToggle />
        <!-- <Settings /> -->
        <LayoutHeaderUser />
      </ASpace>
    </div>
  </a-layout-header>
</template>
