import type { components } from '~/api/v1/types'

export type UIAnyNavigationItem = UIGroupNavigationItem | UISubNavigationItem | UINavigationItem

export interface UIGroupNavigationItem {
  label: string
  group: UIAnyNavigationItem[]
  permissions?: components['schemas']['PermissionCode'][]
  key?: PropertyKey
  [k: string]: unknown
}

export interface UISubNavigationItem {
  icon?: any
  label: string
  children: UIAnyNavigationItem[]
  permissions?: components['schemas']['PermissionCode'][]
  key?: PropertyKey
  [k: string]: unknown
}

export interface UINavigationItem {
  icon?: any
  label: string
  disabled?: boolean
  permissions?: components['schemas']['PermissionCode'][]
  key?: PropertyKey
  to: import('vue-router').RouteLocationNamedI18n
  [k: string]: unknown
}
