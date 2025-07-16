import type { PermissionCode } from '~/api/v1_1'

export type UIAnyNavigationItem = UIGroupNavigationItem | UISubNavigationItem | UINavigationItem

export interface UIGroupNavigationItem {
  label: string
  group: UIAnyNavigationItem[]
  permissions?: PermissionCode[]
  key?: string
  [k: string]: unknown
}

export interface UISubNavigationItem {
  icon?: any
  label: string
  children: UIAnyNavigationItem[]
  permissions?: PermissionCode[]
  key?: string
  [k: string]: unknown
}

export interface UINavigationItem {
  icon?: any
  label: string
  disabled?: boolean
  permissions?: PermissionCode[]
  key?: string
  to: import('vue-router').RouteLocationNamedI18n
  [k: string]: unknown
}
