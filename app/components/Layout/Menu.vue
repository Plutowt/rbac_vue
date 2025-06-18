<script setup lang="ts">
import type { SetOptional } from 'type-fest'
import type { UIAnyNavigationItem, UIGroupNavigationItem, UINavigationItem, UISubNavigationItem } from '~/components/UI/MenuItems/types'
import {
  IconHome,
  IconLock,
  IconUserGroup,
} from '@arco-design/web-vue/es/icon'
import { has } from 'es-toolkit/compat'
import { nanoid } from 'nanoid'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

function withKey(items: SetOptional<UIAnyNavigationItem, 'key'>[]): UIAnyNavigationItem[] {
  const result: UIAnyNavigationItem[] = []

  for (const i of items) {
    if (has(i, 'group')) {
      i.key = nanoid()
      i.group = withKey((i as UIGroupNavigationItem).group)
    }
    else if (has(i, 'children')) {
      i.key = nanoid()
      i.children = withKey((i as UISubNavigationItem).children)
    }
    else {
      i.key = localePath((i as UINavigationItem).to)
    }
    result.push(i)
  }
  return result
}

const items = computed<UIAnyNavigationItem[]>(() => withKey([
  { icon: IconHome, label: t('common.menu.home'), to: 'index' },
  { icon: IconLock, label: t('common.menu.roles'), to: 'roles' },
  { icon: IconUserGroup, label: t('common.menu.users'), to: 'users', roles: ['admin'] },
  // {
  //   icon: IconCommon,
  //   label: t('common.menu.deviceManage.label'),
  //   children: [
  //   ],
  // },
  // {
  //   icon: IconApps,
  //   label: t('common.menu.appSettings.label'),
  //   children: [
  //     // { label: t('common.menu.appSettings.phoneQueryTemplate'), to: '/app_settings/phone_query_templates' },
  //     // { label: t('common.deviceUser'), to: '/devices/users' },
  //   ],
  // },
  // {
  //   icon: IconRelation,
  //   label: t('common.openapi'),
  //   to: '/openapi',
  // },
  // { icon: IconMindMapping, label: t('common.menu.operationLog'), to: '/operation_logs', roles: ['admin'] },
]))

function onClickMenuItem(
  key: import('vue-router').RouteLocationNamedI18n,
) {
  navigateTo(localePath(key))
}

const sidebar = useSidebar()

const selectedKeys = ref([route.path])
</script>

<template>
  <AMenu
    v-model:collapsed="sidebar.collapsed"
    v-model:selected-keys="selectedKeys"
    class="h-full"
    show-collapse-button
    @collapse="sidebar.toggleCollapse"
    @menu-item-click="onClickMenuItem"
  >
    <UIMenuItems :items="items" />
  </AMenu>
</template>
