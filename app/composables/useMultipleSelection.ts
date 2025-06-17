export function useMultipleSelection<T>(
  state: MaybeRef<T[] | undefined>,
  options?: { key?: keyof T, keep?: boolean, condition?: (item: T) => boolean },
) {
  const selection: Ref<T[]> = ref([])
  const lastSelected = ref<T>()
  const rangeBefore: Ref<T[] | undefined> = ref()

  const key = options?.key

  // 如果 state 变动了，那么从已经选中的项中排除不存在于新 state 中的值
  watch(
    () => unref(state),
    (n) => {
      // 如果选项里配置了不保存已选中的值
      if (!options?.keep) {
        // 如果新值是 undefined, 则清空已选中的值, 否则过滤掉不存在于新值中的项
        selection.value = n === undefined
          ? []
          : n.filter(ni => selection.value.findIndex(oi => eq(oi, ni, key)) > -1)
      }

      // 如果新的值是空的 重置最后选中的项
      if (n === undefined) {
        lastSelected.value = undefined
      }
      else {
        const newLastIndex = n.findIndex(ni => eq(ni, lastSelected.value, key))
        // 如果新的值里存在最后选中的项, 则更新
        lastSelected.value = newLastIndex > -1 ? n[newLastIndex] : undefined
      }
    },
  )

  // 如果最后选中的项变了, 那么重置
  watch(lastSelected, () => {
    rangeBefore.value = undefined
  })

  /**
   * 如果值已经选择，则剔除，否则添加
   * @param value 要切换的值
   * @returns 如果值已经选择，则返回 false, 否则返回 true
   */
  function toggle(value: T) {
    lastSelected.value = value
    rangeBefore.value = undefined

    const [existing, index] = findBy<T>(selection.value, value, key)

    if (existing) {
      selection.value.splice(index, 1)
    }
    else if (options?.condition) {
      if (options.condition(value))
        selection.value.push(value)
    }
    else {
      selection.value.push(value)
    }
    return !existing
  }

  /**
   * 选择或取消全选
   * @param predicate 条件表达式, 如果计算结果为真, 则选中, 否则不选中
   */
  function all(predicate?: (value: T) => boolean | undefined) {
    lastSelected.value = undefined
    rangeBefore.value = undefined
    const items = unref(state)

    if (items) {
      if (predicate === undefined) {
        selection.value = isSubset(items, selection.value, key)
          ? []
          : options?.condition
            ? items.filter(i => options?.condition!(i))
            : [...items]
      }
      else {
        const results: T[] = []

        items.forEach((i) => {
          if (predicate(i))
            results.push(i)
        })

        selection.value = results
      }
    }
  }

  /**
   * 范围选择
   * @param current 结束范围
   * @param predicate 条件表达式, 如果计算结果为真, 则选中, 否则不选中
   */
  function range(current: T, predicate?: (value: T) => boolean | undefined) {
    const currentState = unref(state)
    const currentIndex = currentState?.findIndex(i => eq(i, current, key))

    if (currentState && currentIndex !== undefined && currentIndex > -1) {
      let lastSelectedIndex: number

      // 如果没有设置最后选择的，则设置默认选择第一项
      if (lastSelected.value === undefined) {
        lastSelectedIndex = 0
        lastSelected.value = currentState[lastSelectedIndex]
      }
      else {
        lastSelectedIndex = currentState.findIndex(i => eq(i, lastSelected.value, key))
      }

      // 如果刚刚有选择, 则恢复到刚刚的状态
      if (rangeBefore.value !== undefined)
        selection.value = [...rangeBefore.value]

      // 设置范围
      const range_ = { start: 0, end: 0 }
      if (lastSelectedIndex > currentIndex) {
        range_.start = currentIndex
        range_.end = lastSelectedIndex
      }
      else {
        range_.start = lastSelectedIndex
        range_.end = currentIndex
      }

      rangeBefore.value = [...selection.value]
      currentState.slice(range_.start, range_.end + 1).forEach((i) => {
        // 将没有选择的项选中
        const [existing] = findBy(selection.value, i, key)
        if (!existing) {
          if (predicate === undefined) {
            if (options?.condition) {
              if (options?.condition(i))
                selection.value.push(i)
            }
            else {
              selection.value.push(i)
            }
          }
          else {
            if (predicate(i))
              selection.value.push(i)
          }
        }
      })
    }
  }

  function selected(value: T) {
    return findBy(selection.value, value, key)[0]
  }

  return { selection, selected, select: { toggle, all, range } }
}
