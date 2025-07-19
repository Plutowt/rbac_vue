import { layoutSidebarWidth } from '@/constants'

export const useSidebar = defineStore('sidebar', () => {
  const { lg, sm, isSmaller } = useArcoBreakpoints()

  // 是否收起, 默认是大屏就收起
  const collapsed = ref(isSmaller('lg'))
  function toggleCollapse(value: boolean) {
    collapsed.value = value
  }

  // 收起后宽度
  const collapsedWidth = 48
  // 展开后宽度
  const expandedWidth = ref(layoutSidebarWidth)

  // 当前宽度
  const width = computed(
    () => collapsed.value ? collapsedWidth : expandedWidth.value,
  )

  // 是否弹出显示, 这个应该适合 collapsed 冲突的
  const [popShow, togglePopShow] = useToggle(false)

  watchEffect(() => {
    // 检查是不是大屏
    if (lg.value) {
      toggleCollapse(false)
    }
    // 检查是不是小屏
    else if (sm.value) {
      togglePopShow(false)
      toggleCollapse(true)
    }
    // 比小屏小
    else if (!sm.value) {
      toggleCollapse(false)
    }
  })

  return {
    collapsed,
    toggleCollapse,
    expandedWidth,
    width,
    popShow,
    togglePopShow,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSidebar, import.meta.hot))
}
