import type { NuxtLinkProps } from 'nuxt/app'
import type { UserRole } from '~/api/v1/users'

declare global {
  type UIAnyNavigationItem = UISubNavigationItem | UIGroupNavigationItem | UINavigationItem

  interface UISubNavigationItem {
    icon?: any
    label: string
    children: UIAnyNavigationItem[]
    roles?: UserRole[]
  }

  interface UIGroupNavigationItem {
    label: string
    group: UIAnyNavigationItem[]
    roles?: UserRole[]
  }

  interface UINavigationItem extends NuxtLinkProps {
    icon?: any
    label: string
    disabled?: boolean
    roles?: UserRole[]
  }

  interface UIDataOption<T> {
    sort?: boolean
    field: keyof T
    type: FieldType
    label: string
    icon?: string
    [k: string]: unknown
  }
}

export {}
