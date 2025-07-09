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
const router = useRouter()
const auth = useAuth()

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

/**
 * 显示当前用户有权限访问的菜单
 */
function permissionFilter(items: UIAnyNavigationItem[]) {
  const result: UIAnyNavigationItem[] = []

  for (const i of items) {
    let invalid = false
    if (has(i, 'group')) {
      i.group = permissionFilter((i as UIGroupNavigationItem).group)
    }
    else if (has(i, 'children')) {
      i.children = permissionFilter((i as UISubNavigationItem).children)
    }
    else {
      const r = router.options.routes.find(r => r.path === i.key)

      if (r) {
        const requires = r.meta?.permissions
        // 如果有要求权限
        if (requires?.length) {
          // 登录了就检查
          if (auth.info) {
            // 检查是否具备任意一项权限
            invalid = !useHasAnyPermission(...requires)
          }
          // 没登陆就不显示
          else {
            invalid = true
          }
        }
      }
    }
    if (!invalid)
      result.push(i)
  }

  return result
}

const items = computed<UIAnyNavigationItem[]>(() => permissionFilter(withKey([
  { icon: IconHome, label: t('common.menu.home'), to: 'index' },
  {
    icon: IconLock,
    label: t('common.menu.roles'),
    to: 'roles',
  },
  {
    icon: IconUserGroup,
    label: t('common.menu.users'),
    to: 'users',
  },
  {
    // icon: IconUserGroup,
    label: 'invalid permission demo',
    to: 'invalid-permission',
  },
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
])))

function onClickMenuItem(
  key: import('vue-router').RouteLocationNamedI18n,
) {
  navigateTo(localePath(key))
}

const sidebar = useSidebar()

const selectedKeys = ref([route.path])
const { sm } = useArcoBreakpoints()
</script>

<template>
  <AMenu
    v-model:collapsed="sidebar.collapsed"
    v-model:selected-keys="selectedKeys"
    class="h-full"
    :show-collapse-button="sm"
    @collapse="sidebar.toggleCollapse"
    @menu-item-click="onClickMenuItem"
  >
    <UIMenuItems :items="items" />
  </AMenu>
</template>
