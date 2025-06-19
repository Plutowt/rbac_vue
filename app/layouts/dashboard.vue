<script setup lang="ts">
import { layoutHeaderHeight } from '~/constants'

const sidebar = useSidebar()
const paddingLeft = computed(() => `${sidebar.width}px`)
const paddingTop = `${layoutHeaderHeight}px`
const { sm } = useArcoBreakpoints()
</script>

<template>
  <a-layout class="size-full">
    <LayoutHeader class="fixed top-0 z-50 w-full" />
    <ALayout>
      <LayoutSidebar
        v-if="sm"
        :data-width="paddingLeft"
        class="!fixed left-0 top-0 z-40 h-full" :style="{ paddingTop }"
      />
      <div v-else id="sidebar-drawer">
        <ADrawer
          :style="{ marginTop: paddingTop }"
          placement="left"
          :header="false"
          :footer="false"
          :closable="false"
          :visible="sidebar.popShow"
          popup-container="#sidebar-drawer"
          @ok="sidebar.togglePopShow(false)"
          @cancel="sidebar.togglePopShow(false)"
        >
          <LayoutMenu />
        </ADrawer>
      </div>

      <a-layout
        class="c-layout h-full"
        :style="{ paddingTop, paddingLeft: sm ? paddingLeft : null }"
      >
        <a-layout-content class="h-full p-6">
          <slot />
        </a-layout-content>
        <LayoutFooter />
      </a-layout>
    </ALayout>
  </a-layout>
</template>

<style lang="postcss" scoped>
#sidebar-drawer:deep(.arco-drawer-body) {
  @apply p-0;
}
</style>
