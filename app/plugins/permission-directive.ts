// 这里是定义操作，组件上的类型声明参考 types/index.d.ts
export default defineNuxtPlugin((nuxtApp) => {
  const directive: VPermissions = {
    mounted: (el, binding) => {
      if (!binding.value || !useHasAnyPermission(...binding.value))
        el.remove()
    },
  }
  nuxtApp.vueApp.directive('permissions', directive)
})
