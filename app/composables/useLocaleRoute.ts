import type { RouteLocation, RouteLocationRaw } from 'vue-router'

export function $lp(route: RouteLocation | RouteLocationRaw) {
  const lp = useLocalePath()
  return navigateTo(lp(route))
}
