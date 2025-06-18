export interface SelectionBoxOptions {
  container?: HTMLElement | null
  disabled?: Ref<boolean>
  onSelect?: (selectedItems: HTMLElement[]) => void
}
function getElementPath(element: HTMLElement): string[] {
  const path: string[] = []
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector += `#${current.id}`
    }

    if (current.className) {
      selector += `.${current.className.split(' ').join('.')}`
    }

    path.unshift(selector)
    current = current.parentElement
  }

  return path
}

export function useSelectionBox(options: SelectionBoxOptions = {}) {
  const { container, disabled = ref(false), onSelect } = options

  const isShift = ref(false)
  onKeyStroke('Shift', () => isShift.value = true, { eventName: 'keydown', dedupe: true })
  onKeyStroke('Shift', () => isShift.value = false, { eventName: 'keyup', dedupe: true })

  const isCtrl = ref(false)
  onKeyStroke('Control', () => isCtrl.value = true, { eventName: 'keydown', dedupe: true })
  onKeyStroke('Control', () => isCtrl.value = false, { eventName: 'keyup', dedupe: true })

  // 鼠标位置和按压状态
  const { x: mouseX, y: mouseY } = useMouse()
  const { pressed } = useMousePressed()

  // 页面滚动状态
  const { x: scrollX, y: scrollY } = useScroll(window)

  // 选择框状态
  const isSelecting = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const startScrollX = ref(0)
  const startScrollY = ref(0)
  const currentX = ref(0)
  const currentY = ref(0)

  // 获取相对于文档的坐标
  const getDocumentCoordinate = (clientX: number, clientY: number) => {
    return {
      x: clientX + scrollX.value,
      y: clientY + scrollY.value,
    }
  }

  // 计算选择框的样式
  const selectionBox = computed(() => {
    if (!isSelecting.value)
      return null

    // 获取当前鼠标位置
    const currentDocX = mouseX.value
    const currentDocY = mouseY.value

    // 计算选择框的边界（相对于文档）
    const left = Math.min(startX.value, currentDocX)
    const top = Math.min(startY.value, currentDocY)
    const width = Math.abs(currentDocX - startX.value)
    const height = Math.abs(currentDocY - startY.value)

    // 转换为相对于视口的位置
    const viewportLeft = left - scrollX.value
    const viewportTop = top - scrollY.value

    return {
      left: `${viewportLeft}px`,
      top: `${viewportTop}px`,
      width: `${width}px`,
      height: `${height}px`,
    }
  })

  const selection = ref<HTMLElement[]>([])

  // 监听鼠标按下
  watch(pressed, (isPressed) => {
    if (disabled.value)
      return

    const el = document.elementFromPoint(mouseX.value, mouseY.value) as HTMLElement

    if (isPressed) {
      // 点击的是 arco 的元素, 并且不是 arco-layout-content
      if (el && ((/arco-/.test(el.className || '') && !el.classList.contains('arco-layout-content')) || (getElementPath(el).find(i => /\.arco-table/.test(i))))) {
        return
      }

      document.body.classList.toggle('select-none', true)
    }
    else {
      document.body.classList.toggle('select-none', false)
    }

    if (isPressed && !isSelecting.value) {
      // 开始选择 - 记录文档坐标
      isSelecting.value = true

      startX.value = mouseX.value
      startY.value = mouseY.value
      startScrollX.value = scrollX.value
      startScrollY.value = scrollY.value
    }
    else if (!isPressed && isSelecting.value) {
      // 结束选择
      isSelecting.value = false

      // 计算选中的元素
      const newSelectedElements = getElementsInSelection()

      if (isCtrl.value) {
        // 新选的和旧选的, 如果有交叉, 则排除
        const a = new Set(newSelectedElements)
        const b = new Set(selection.value)

        selection.value = [...newSelectedElements.filter(i => !b.has(i)), ...selection.value.filter(i => !a.has(i))]
      }
      else if (isShift.value) {
        selection.value = [...newSelectedElements.filter(n => !selection.value.includes(n)), ...selection.value]
      }
      else {
        selection.value = newSelectedElements
      }

      if (onSelect)
        onSelect(selection.value)
    }
  })

  // 监听鼠标移动
  watch([mouseX, mouseY], ([x, y]) => {
    if (isSelecting.value) {
      const docCoords = getDocumentCoordinate(x, y)
      currentX.value = docCoords.x
      currentY.value = docCoords.y
    }
  })

  // 获取选择框内的元素
  function getElementsInSelection(): HTMLElement[] {
    // 计算选择框的文档坐标
    const currentDocX = mouseX.value

    const currentDocY = mouseY.value

    // const left = startX.value
    const left = Math.min(startX.value, currentDocX)
    // const top = startY.value
    const top = Math.min(startY.value, currentDocY)
    const right = Math.max(startX.value, currentDocX)
    const bottom = Math.max(startY.value, currentDocY)

    const containerElement = container || document.body
    const selectableElements = containerElement.querySelectorAll('.data-selectable')

    const selectedElements: HTMLElement[] = []

    selectableElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      // 转换为文档坐标
      const elementLeft = rect.left + scrollX.value
      const elementTop = rect.top + scrollY.value
      const elementRight = elementLeft + rect.width
      const elementBottom = elementTop + rect.height

      // 检查元素是否与选择框相交
      if (
        elementLeft < right
        && elementRight > left
        && elementTop < bottom
        && elementBottom > top
      ) {
        selectedElements.push(element as HTMLElement)
      }
    })

    return selectedElements
  }

  return {
    isSelecting: readonly(isSelecting),
    selectionBox,
    selection,
  }
}
