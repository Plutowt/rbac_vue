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
        class="!fixed top-0 left-0 z-40 h-full" :style="{ paddingTop }"
      />
      <ADrawer
        class="sidebar-drawer"
        :style="{ marginTop: paddingTop }"
        placement="left"
        :header="false"
        :footer="false"
        :closable="false"
        :visible="sidebar.popShow"
        popup-container="body"
        @ok="sidebar.togglePopShow(false)"
        @cancel="sidebar.togglePopShow(false)"
      >
        <LayoutMenu />
      </ADrawer>

      <a-layout
        class="h-full"
        :style="{ paddingTop, paddingLeft: sm ? paddingLeft : null }"
      >
        <a-layout-content class="size-full">
          <slot />
        </a-layout-content>
        <LayoutFooter />
      </a-layout>
    </ALayout>
  </a-layout>
</template>
