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
  enableToggleVisible?: boolean
  defaultVisible?: boolean
  title?: string | null | ComputedRef<string | null>
}
// (record: TableData, column: TableColumnData, ev: Event) => any
type ExcludeTypeTableColumnData = Omit<TableColumnData, keyof TypeTableColumnData>

const sortMap = { asc: 'ascend', desc: 'descend' }

export type TableColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData)[]
export type TableAllColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData & { visible: Ref<boolean> })[]
export type TableVisibleColumns = TableColumnData[]
export type TableToggleVisibleColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData & { visible: Ref<boolean>, toggleVisible: () => void })[]

export function apiV1TableColumns<T>(
  _columns: TableColumns<T>,
): {
  allColumns: TableAllColumns<T>
  visibleColumns: ComputedRef<TableVisibleColumns>
  toggleVisibleColumns: TableToggleVisibleColumns<T>
} {
  const { t } = useNuxtApp().$i18n

  const allColumns = _columns.map((i) => {
    const result = {
      title: computed(() => t(`common.${i.dataIndex}`)),
      visible: ref(i.defaultVisible),
      ...i,
    }

    if (i.sortable) {
      const value = i.sortable.map(ii => sortMap[ii]) as ('ascend' | 'descend')[]
      (result as unknown as TableColumnData).sortable = {
        sortDirections: value,
        sorter: true,
      }
    }

    return result
  }) as TableAllColumns<T>

  const visibleColumns = computed(() => (allColumns.filter(i => i.visible.value !== false) as TableColumnData[]))
  const toggleVisibleColumns = allColumns.filter(i => i.enableToggleVisible).map(i => ({
    ...i,
    toggleVisible: () => { i.visible.value = i.visible.value === undefined ? false : !i.visible.value },
  }))
  return { allColumns, visibleColumns, toggleVisibleColumns }
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
