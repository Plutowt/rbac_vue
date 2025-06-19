<script setup lang="ts">
import {
  enabledSidebarWidthChange,
  layoutSidebarWidth,
} from '~/constants'

const sidebar = useSidebar()

if (enabledSidebarWidthChange) {
  useDraggable(
    useTemplateRef('control'),
    {
      onStart: () => {
        document.querySelector('body')?.classList.toggle('select-none', true)
        document.querySelector('body')?.classList.toggle('cursor-col-resize', true)
      },
      onEnd: () => {
        document.querySelector('body')?.classList.toggle('select-none', false)
        document.querySelector('body')?.classList.toggle('cursor-col-resize', false)
      },
      onMove: ({ x }) => {
        if (x >= layoutSidebarWidth - 50 && x <= layoutSidebarWidth + 50) {
          sidebar.expandedWidth = x
        }
      },
    },
  )
}
</script>

<template>
  <a-layout-sider
    hide-trigger
    collapsible
    :width="sidebar.width"
    :collapsed="sidebar.collapsed"
    @collapse="sidebar.toggleCollapse"
  >
    <LayoutMenu />
    <div
      ref="control"
      class="group absolute -right-2 top-0 flex h-full w-2 cursor-col-resize touch-none touch-pan-y items-center justify-center transition-colors hover:bg-[var(--color-fill-3)] active:cursor-col-resize active:bg-[var(--color-fill-3)]"
    />
  </a-layout-sider>
</template>
