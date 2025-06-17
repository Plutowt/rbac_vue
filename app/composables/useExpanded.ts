export function useExpanded(opts: { multiple: boolean }) {
  const items = ref<number[]>([])
  function expanded(index: number): boolean {
    return items.value.findIndex(i => i === index) >= 0
  }
  function toggle(index: number): void {
    if (opts.multiple)
      items.value = expanded(index) ? items.value.filter(i => i !== index) : [...items.value, index]
    else
      items.value = expanded(index) ? [] : [index]
  }
  return { expanded, toggle }
}
