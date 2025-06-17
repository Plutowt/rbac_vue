<script setup lang="ts">
defineProps<{ items: (UIAnyNavigationItem & { key?: any })[] }>()

const auth = useAuth()
function validRole(item: UIAnyNavigationItem) {
  return item.roles ? (auth.info && item.roles.includes(auth.info.role)) : true
}
</script>

<template>
  <template v-for="nav in items" :key="nav.key">
    <a-menu-item-group v-if="(nav as UIGroupNavigationItem).group && validRole(nav)" :title="(nav as UIGroupNavigationItem).label">
      <UINavigationItems :items="(nav as UIGroupNavigationItem).group" />
    </a-menu-item-group>
    <a-sub-menu v-else-if="(nav as UISubNavigationItem).children && validRole(nav)" :key="nav.key">
      <template v-if="(nav as UISubNavigationItem).icon" #icon>
        <component :is="(nav as UISubNavigationItem).icon" />
      </template>
      <template #title>
        {{ nav.label }}
      </template>
      <UINavigationItems :items="(nav as UISubNavigationItem).children" />
    </a-sub-menu>
    <template v-else-if="validRole(nav)">
      <a-menu-item :key="nav.key" :disabled="(nav as UINavigationItem).disabled">
        <template v-if="(nav as UINavigationItem).icon" #icon>
          <component :is="(nav as UINavigationItem).icon" />
        </template>
        {{ (nav as UINavigationItem).label }}
      </a-menu-item>
    </template>
  </template>
</template>
