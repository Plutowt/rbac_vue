import type { TableColumnData, TableData } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'
import type { VNodeChild } from 'vue'
import type { APIResult } from '~/api/v1'
import { remove } from 'es-toolkit'
import { findIndex } from 'es-toolkit/compat'

type TypeTableRecord<T> = TableData & T

interface TypeTableColumnData<APIResultT = unknown, DataIndex = Paths<APIResultT>> {
  dataIndex?: DataIndex
  sortable?: ['asc', 'desc'] | ['desc', 'asc'] | ['asc'] | ['desc']
  render?: (data: {
    record: TypeTableRecord<APIResultT>
    column: { title: string, dataIndex: DataIndex }
    rowIndex: number
  }) => VNodeChild
}
// (record: TableData, column: TableColumnData, ev: Event) => any
type ExcludeTypeTableColumnData = Omit<TableColumnData, keyof TypeTableColumnData>

const sortMap = {
  asc: 'ascend',
  desc: 'descend',
}

export function apiV1TableColumns<T>(
  _columns: (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData)[],
) {
  const { t } = useNuxtApp().$i18n
  return _columns.map((i) => {
    const result = {
      title: computed(() => t(`common.${i.dataIndex}`)),
      ...i,
    } as unknown as TableColumnData

    if (i.sortable) {
      const value = i.sortable.map(ii => sortMap[ii])
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

// export function  apiV1TableOnCellContextmenu(record: TypeTableRecord<APIResultT>, column: TableColumnData, ev: Event)
