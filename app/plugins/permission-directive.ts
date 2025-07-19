import type { Directive } from 'vue'
import type { PermissionCode } from '../api/v1_1'

export type VPermission = Directive<Element, PermissionCode[]>

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    vAnyPermission: VPermission
    vAllPermission: VPermission
    vPermission: VPermission
  }
}

export {}

// 这里是定义操作，组件上的类型声明参考 types/index.d.ts
export default defineNuxtPlugin((nuxtApp) => {
  const any: VPermission = {
    mounted: (el, binding) => {
      if (!binding.value || !useHasAnyPermission(...binding.value))
        el.remove()
    },
  }
  nuxtApp.vueApp.directive('anyPermission', any)
  nuxtApp.vueApp.directive('permission', any)

  const all: VPermission = {
    mounted: (el, binding) => {
      if (!binding.value || !useHasAllPermissions(...binding.value))
        el.remove()
    },
  }
  nuxtApp.vueApp.directive('allPermission', all)
})
