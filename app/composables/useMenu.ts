import type { SetOptional } from 'type-fest'
import type { PermissionCode } from '~/api/v1_1'

import {
  IconDesktop,
  IconHome,
  IconLock,
  IconUserGroup,
} from '@arco-design/web-vue/es/icon'
import { has } from 'es-toolkit/compat'

import { defineStore } from 'pinia'

type UIAnyNavigationItem = UIGroupNavigationItem | UISubNavigationItem | UINavigationItem

interface UIGroupNavigationItem {
  label: string
  group: UIAnyNavigationItem[]
  permissions?: PermissionCode[]
  key?: string
  [k: string]: unknown
}

interface UISubNavigationItem {
  icon?: any
  label: string
  children: UIAnyNavigationItem[]
  permissions?: PermissionCode[]
  key?: string
  [k: string]: unknown
}

interface UINavigationItem {
  icon?: any
  label: string
  disabled?: boolean
  permissions?: PermissionCode[]
  key?: string
  to: import('vue-router').RouteLocationNamedI18n
  [k: string]: unknown
}

export function isSubNavigationItem(value: UIAnyNavigationItem): value is UISubNavigationItem {
  return has(value, 'children')
}

export function isGroupNavigationItem(value: UIAnyNavigationItem): value is UIGroupNavigationItem {
  return has(value, 'group')
}

export const useMenu = defineStore('menu', () => {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const router = useRouter()
  const auth = useAuth()

  const route = useRoute()
  const selectedKeys = ref([route.path])

  const options: ComputedRef<UIAnyNavigationItem[]> = computed(() => permissionFilter(withKey([
    {
      icon: IconHome,
      label: t('common.menu.home'),
      to: 'index',
    },
    {
      icon: IconDesktop,
      label: t('common.menu.system'),
      children: [
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
      ],
    },
    {
    // icon: IconUserGroup,
      label: 'invalid permission demo',
      to: 'invalid-permission',
    },
  ])))

  function getParent(k: string, parent?: UIAnyNavigationItem): UISubNavigationItem | UIGroupNavigationItem | null {
    if (parent) {
      if (isSubNavigationItem(parent)) {
        for (const element of parent.children) {
          if (element.key === k)
            return parent
        }
      }
      else if (isGroupNavigationItem(parent)) {
        for (const element of parent.group) {
          if (element.key === k)
            return parent
        }
      }
      return null
    }

    for (const element of options.value) {
      if (element.key === k && (isSubNavigationItem(element) || isGroupNavigationItem(element)))
        return element
    }

    for (const element of options.value) {
      const result = getParent(k, element)
      if (result !== null)
        return result
    }
    return null
  }

  const openKeys = ref((() => {
    const result: string[] = []
    for (const k of selectedKeys.value) {
      const p = getParent(k)
      if (p !== null)
        result.push(p.key as string)
    }
    return result
  })())

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
          const requires = r.meta?.anyPermissions
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

  function withKey(
    items: SetOptional<UIAnyNavigationItem, 'key'>[],
    parent?: UISubNavigationItem | UIGroupNavigationItem,
  ): UIAnyNavigationItem[] {
    const result: UIAnyNavigationItem[] = []

    for (const [index, i] of items.entries()) {
      if (isGroupNavigationItem(i)) {
        i.key = parent?.key ? `${parent.key}_${index}` : index.toString()
        i.group = withKey(i.group, i)
      }
      else if (isSubNavigationItem(i)) {
        i.key = parent?.key ? `${parent.key}_${index}` : index.toString()
        i.children = withKey(i.children, i)
      }
      else {
        i.key = localePath(i.to)
      }
      i.parent = parent
      result.push(i)
    }
    return result
  }

  function select(
    key: import('vue-router').RouteLocationNamedI18n,
  ) {
    navigateTo(localePath(key))
  }

  return { selectedKeys, openKeys, options, select }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenu, import.meta.hot))
}
