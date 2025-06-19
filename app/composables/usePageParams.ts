import type { PaginationProps } from '@arco-design/web-vue'

export function usePageParams(options?: {
  no?: number
  size?: number
  max?: MaybeRef<number | undefined>
  total?: MaybeRef<number | undefined>
}) {
  const defaultValue = { no: options?.no || 1, size: options?.size || 10 }
  const max = options?.max

  const no = ref(defaultValue.no)
  const size = ref(defaultValue.size)

  function reset() {
    no.value = defaultValue.no
    size.value = defaultValue.size
  }

  function nextPage() {
    if (max === undefined) {
      no.value++
    }
    else {
      const value = toValue(max)
      if (value === undefined) {
        no.value++
      }
      else if (value > no.value) {
        no.value++
      }
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
    total: options?.total,
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
      total: options?.total,
    } satisfies PaginationProps,
    onPageChange,
    onPageSizeChange,
  }))

  return { no, size, reset, pagination, nextPage, prevPage, onPageChange, onPageSizeChange, arcoTable }
}
