<script setup lang="tsx">
import { MenuItem, MenuItemGroup, SubMenu } from '@arco-design/web-vue'

const sidebar = useSidebar()
const menu = useMenu()

const { sm } = useArcoBreakpoints()

function MenuItems() {
  function travel(routes: typeof menu.options, nodes = []) {
    for (const [index, element] of routes.entries()) {
      const node = (
        isSubNavigationItem(element)
          ? (
              <SubMenu key={element.key}>
                {{
                  default: () => travel(element.children),
                  icon: element.icon ? () => h(element.icon) : null,
                  title: () => element.label,
                }}
              </SubMenu>
            )
          : isGroupNavigationItem(element)
            ? (
                <MenuItemGroup key={index}>
                  {{
                    default: () => travel(element.group),
                    title: () => element.label,
                  }}
                </MenuItemGroup>
              )
            : (
                <MenuItem key={element.key}>
                  {{
                    default: () => element.label,
                    icon: element.icon ? () => h(element.icon) : null,
                  }}
                </MenuItem>
              )
      )
      nodes.push(node as never)
    }
    return nodes
  }
  return <>{travel(menu.options)}</>
}
</script>

<template>
  <AMenu
    v-model:collapsed="sidebar.collapsed"
    v-model:selected-keys="menu.selectedKeys"
    v-model:open-keys="menu.openKeys"
    :default-open-keys="menu.openKeys"
    :show-collapse-button="sm"
    class="h-full"
    auto-open
    @collapse="sidebar.toggleCollapse"
    @menu-item-click="menu.select"
  >
    <MenuItems />
  </AMenu>
</template>
