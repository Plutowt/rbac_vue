<script setup lang="ts">
import type { UIAnyNavigationItem, UIGroupNavigationItem, UISubNavigationItem } from './types'

defineProps<{ items: UIAnyNavigationItem[] }>()

const auth = useAuth()
function checkPermissions(item: UIAnyNavigationItem): boolean {
  // 声明了所需权限
  if (item.permissions) {
    // 登录了
    if (auth.info) {
      const userPermissions = auth.info.permissions
      // 用户是否包含所需权限
      return item.permissions.every(i => userPermissions.includes(i))
    }
    return false
  }
  // 没声明所需权限
  else {
    return true
  }
}
</script>

<template>
  <template v-for="nav in items" :key="nav.key">
    <a-menu-item-group
      v-if="nav.group && checkPermissions(nav)"
      :title="nav.label"
    >
      <UIMenuItems :items="(nav as UIGroupNavigationItem).group" />
    </a-menu-item-group>

    <a-sub-menu
      v-else-if="nav.children && checkPermissions(nav)"
      :key="nav.key"
    >
      <template v-if="nav.icon" #icon>
        <component :is="nav.icon" />
      </template>
      <template #title>
        {{ nav.label }}
      </template>
      <UIMenuItems :items="(nav as UISubNavigationItem).children" />
    </a-sub-menu>

    <template v-else-if="checkPermissions(nav)">
      <a-menu-item :key="nav.key" :disabled="!!nav.disabled">
        <template v-if="nav.icon" #icon>
          <component :is="nav.icon" />
        </template>
        {{ nav.label }}
      </a-menu-item>
    </template>
  </template>
</template>
