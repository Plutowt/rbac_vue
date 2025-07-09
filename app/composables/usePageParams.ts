import type { PaginationProps } from '@arco-design/web-vue'

export function usePageParams(options?: {
  no?: number
  size?: number
}) {
  const defaultValue = { no: options?.no || 1, size: options?.size || 10 }
  const total = ref<number>()

  const no = ref(defaultValue.no)
  const size = ref(defaultValue.size)

  const max = computed(() => {
    if (total.value)
      return Math.ceil(total.value / size.value)
    else
      return 1
  })

  function reset() {
    no.value = defaultValue.no
    size.value = defaultValue.size
  }

  function nextPage() {
    if (max.value === undefined || max.value > no.value) {
      no.value++
    }
  }

  function prevPage() {
    no.value = Math.max(no.value - 1, 1)
  }

  const pagination = computed<PaginationProps>(() => ({
    current: no.value,
    pageSize: size.value,
    showTotal: true,
    showPageSize: true,
    total: total.value,
  }))

  const onPageChange = (page: number) => {
    no.value = page
  }

  const onPageSizeChange = (pageSize: number) => {
    size.value = pageSize
  }

  const arcoTable = computed(() => ({
    pagination: {
      current: no.value,
      pageSize: size.value,
      showTotal: true,
      showPageSize: true,
      total: total.value,
    } satisfies PaginationProps,
    onPageChange,
    onPageSizeChange,
  }))

  return { no, size, reset, pagination, nextPage, prevPage, onPageChange, onPageSizeChange, arcoTablePageAttrs: arcoTable, max, total }
}
