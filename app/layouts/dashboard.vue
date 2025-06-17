<script setup lang="ts">
import { layoutHeaderHeight } from '~/constants'

const sidebar = useSidebar()
const paddingLeft = computed(() => `${sidebar.width}px`)
</script>

<template>
  <a-layout class="size-full">
    <LayoutHeader class="fixed top-0 z-50 w-full" />
    <ALayout>
      <LayoutSider
        :data-width="paddingLeft"
        class="!fixed left-0 top-0 z-40 h-full" :style="{ paddingTop: `${layoutHeaderHeight}px` }"
      />

      <a-layout class="h-full" :style="{ paddingTop: `${layoutHeaderHeight}px`, paddingLeft }">
        <a-layout-content class="h-full p-6">
          <slot />
        </a-layout-content>
        <LayoutFooter />
      </a-layout>
    </ALayout>
  </a-layout>
</template>
