<script setup lang="ts">
const sidebar = useSidebar()
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
  </a-layout-sider>
</template>
