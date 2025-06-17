import type { PaginationProps } from '@arco-design/web-vue'
import type { Results } from '~/api/v1/common'

export function usePaginate(options?: { no?: number, size?: number, max?: MaybeRef<number | undefined> }) {
  const defaultValue = { no: options?.no || 1, size: options?.size || 10 }
  const max = options?.max

  const params = reactive({ pageNo: defaultValue.no, pageSize: defaultValue.size })

  function reset() {
    params.pageNo = defaultValue.no
    params.pageSize = defaultValue.size
  }

  function nextPage() {
    if (max === undefined) {
      params.pageNo++
    }
    else {
      const value = toValue(max)
      if (value === undefined) {
        params.pageNo++
      }
      else if (value > params.pageNo) {
        params.pageNo++
      }
    }
  }

  function prevPage() {
    if (params.pageNo > 1)
      params.pageNo--
  }

  // const arcoTableAttrs = computed(() => ({
  //   pagination: {
  //     current: params.pageNo,
  //     pageSize: params.pageSize,
  //     showTotal: true,
  //     showPageSize: true,
  //     total: isRef(initValue?.data) ? initValue?.data.value?.count : initValue?.data?.count,
  //   },
  //   onPageChange: (page: number) => {
  //     params.pageNo = page
  //   },
  //   onPageSizeChange: (pageSide: number) => {
  //     params.pageSize = pageSide
  //   },
  // }))

  function arcoTableAttrs<T>(data: MaybeRef<Results<T> | undefined>): {
    pagination: PaginationProps
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  } {
    return {
      pagination: reactive({
        current: params.pageNo,
        pageSize: params.pageSize,
        showTotal: true,
        showPageSize: true,
        total: isRef(data) ? data.value?.count : data?.count,
      }),
      onPageChange: (page: number) => {
        params.pageNo = page
      },
      onPageSizeChange: (pageSide: number) => {
        params.pageSize = pageSide
      },
    }
  }

  return { params, reset, arcoTableAttrs, nextPage, prevPage }
}
