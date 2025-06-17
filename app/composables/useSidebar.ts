import { breakpointsTailwind } from '@vueuse/core'

export const useSidebar = defineStore('sidebar', () => {
  const { lg } = useBreakpoints(breakpointsTailwind)
  const [expanded, toggleExpanded] = useToggle(lg.value)

  return { expanded, toggleExpanded, width: computed(() => expanded.value ? 224 : 48) }
})
