import type { TableColumnData } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'
import type { APIResult } from '~/api/v1'
import { remove } from 'es-toolkit'
import { findIndex } from 'es-toolkit/compat'

type TypeTableColumnData<APIResultT> = TableColumnData & {
  dataIndex: Paths<APIResultT>
  sortable?: ['asc', 'desc'] | ['desc', 'asc'] | ['asc'] | ['desc']
}

export function apiV1TableColumns<T>(
  _columns: TypeTableColumnData<APIResult<T>>[],
) {
  const { t } = useNuxtApp().$i18n
  return _columns.map((i) => {
    const result: TableColumnData = {
      title: t(`common.${i.dataIndex}`),
      ...i,
    }

    if (i.sortable) {
      const value = []
      if (i.sortable[0] === 'asc') {
        value[0] = 'ascend'
      }
      if (i.sortable[1] === 'desc') {
        value[1] = 'descend'
      }

      result.sortable = {
        sortDirections: value as ('ascend' | 'descend')[],
        sorter: true,
      }
    }

    return result
  })
}

export function apiV1TableOnSorterChange(
  query: MaybeRef<{ sorts?: Array<string> | undefined | null }>,
) {
  function handle(
    dataIndex: string,
    direction: string,
  ) {
    let removeCondition: (i: string) => boolean
    let newValue: string | undefined

    if (direction === 'ascend') {
      removeCondition = i => i === `${dataIndex}.desc`
      newValue = `${dataIndex}.asc`
    }
    else if (direction === 'descend') {
      removeCondition = i => i === `${dataIndex}.asc`
      newValue = `${dataIndex}.desc`
    }
    else {
      removeCondition = i => [`${dataIndex}.asc`, `${dataIndex}.desc`].includes(i)
    }

    const q = (isRef(query) ? query.value : query) || { sorts: [] }

    const index = findIndex(
      q.sorts,
      o => o.startsWith(dataIndex),
    )

    if (!q.sorts) {
      q.sorts = []
    }
    // 找到已有的
    if (index !== -1) {
      // 有新值
      if (newValue) {
        q.sorts[index] = newValue
      }
      else { // 移除已有的
        remove(q.sorts, removeCondition)
      }
    }
    // 没有已有的
    else {
      q.sorts.push(newValue!)
    }
  }

  return handle
}
