import type { SelectProps, TableColumnData, TableData } from '@arco-design/web-vue'
import type { TreeSelectProps } from '@arco-design/web-vue/es/tree-select/interface'
import type { Paths } from 'type-fest'
import type { VNodeChild } from 'vue'
import { remove } from 'es-toolkit'
import { findIndex, get } from 'es-toolkit/compat'
import UITableFilterDatetime from '~/components/UI/Table/Filter/Datetime.vue'
import UITableFilterNumber from '~/components/UI/Table/Filter/Number.vue'
import UITableFilterSelect from '~/components/UI/Table/Filter/Select.vue'
import UITableFilterString from '~/components/UI/Table/Filter/String.vue'
import UITableFilterTreeSelect from '~/components/UI/Table/Filter/TreeSelect.vue'
import UITableFilterUUID from '~/components/UI/Table/Filter/UUID.vue'

type TypeTableRecord<T> = TableData & T

type MaybeProps<T extends object> = T extends Array<infer I> ? MaybeRef<I>[] : {
  [K in keyof T]?: MaybeRef<T[K] | undefined>
}

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
  primary?: boolean
  filter?: ({
    type: 'number' | 'string' | 'datetime' | 'uuid'
  } | {
    type: 'select'
    selectProps: SelectProps
  } | {
    type: 'tree-select'
    treeSelectProps: MaybeProps<TreeSelectProps>
  }) & ({ field?: string, column: boolean })
}

type ExcludeTypeTableColumnData = Omit<TableColumnData, keyof TypeTableColumnData>

const sortMap = { asc: 'ascend', desc: 'descend' }

type TypeTableColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData)[]
type TypeTableAllColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData & { visible: Ref<boolean> })[]
type TypeTableVisibleColumns = TableColumnData[]
export type TypeTableToggleVisibleColumns<T> = (TypeTableColumnData<APIResult<T>> & ExcludeTypeTableColumnData & { visible: Ref<boolean>, toggleVisible: () => void })[]

type FieldFilterValue = { operator: string, value: any }[]

export function useTypeTableColumns<T>(
  _columns: TypeTableColumns<APIPageResult<T>>,
): {
  allColumns: TypeTableAllColumns<T>
  visibleColumns: ComputedRef<TypeTableVisibleColumns>
  toggleVisibleColumns: TypeTableToggleVisibleColumns<T>
  filterExpr: ComputedRef<string | undefined>
} {
  const { t } = useNuxtApp().$i18n

  const filterExpr = reactive<(string | null)[]>([])
  const filterExprValue = computed(() => filterExpr.filter(i => i).join(' and ') || undefined)

  const filterValues = reactive<Record<string, FieldFilterValue>>({})

  const allColumns = _columns.map((i, index) => {
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

    if (i.primary)
      result.render = ({ record, column }) => <div class="text-arco-primary-6">{get(record, column.dataIndex)}</div>

    const field = (i.filter?.field || i.dataIndex) as string | undefined

    if (field !== undefined) {
      const model = computed({
        get: () => filterValues[field]!,
        set: v => filterValues[field] = v,
      })

      const filterProps = ({
        setFilterValue,
        handleFilterReset,
        handleFilterConfirm,
      }: {
        filterValue: string[]
        setFilterValue: (filterValue: string[]) => void
        handleFilterConfirm: (event: Event) => void
        handleFilterReset: (event: Event) => void
      }, initialValue: FieldFilterValue, extra?: any) => ({
        'field': field,
        'modelValue': model.value,
        'onUpdate:modelValue': (v: FieldFilterValue) => model.value = v,
        'onCancel': (e: Event) => {
          filterExpr[index] = null
          model.value = initialValue
          handleFilterReset(e)
        },
        'onConfirm': (value: string | null, e: Event) => {
          value && setFilterValue([value])
          value ? handleFilterConfirm(e) : handleFilterReset(e)

          filterExpr[index] = value
        },
        ...extra,
      })

      switch (i.filter?.type) {
        case 'number':
          if (i.filter.column) {
            model.value = [{ operator: 'eq', value: undefined }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterNumber {...filterProps(data, [{ operator: 'eq', value: undefined }])} />,
            }
          }
          break
        case 'string':
          if (i.filter.column) {
            model.value = [{ operator: 'eq', value: undefined }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterString {...filterProps(data, [{ operator: 'eq', value: undefined }])} />,
            }
          }
          break
        case 'select':
          if (i.filter.column) {
            const selectProps = i.filter.selectProps
            model.value = [{ operator: 'in', value: [] }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterSelect {...filterProps(data, [{ operator: 'in', value: [] }], { selectProps })} />,
            }
          }
          break
        case 'tree-select':
          if (i.filter.column) {
            const treeSelectProps = i.filter.treeSelectProps

            model.value = [{ operator: 'in', value: [] }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterTreeSelect {...filterProps(data, [{ operator: 'in', value: [] }], { treeSelectProps })} />,
            }
          }
          break
        case 'datetime':
          if (i.filter.column) {
            model.value = [{ operator: 'eq', value: undefined }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterDatetime {...filterProps(data, [{ operator: 'eq', value: undefined }])} />,
            }
          }
          break
        case 'uuid':
          if (i.filter.column) {
            model.value = [{ operator: 'eq', value: undefined }]
            result.filterable = {
              filter: () => true,
              renderContent: data => <UITableFilterUUID {...filterProps(data, [{ operator: 'eq', value: undefined }])} />,
            }
          }
          break
        default:
          break
      }
    }

    return result
  }) as TypeTableAllColumns<T>

  const visibleColumns = computed(() => (allColumns.filter(i => i.visible.value !== false) as TableColumnData[]))
  const toggleVisibleColumns = allColumns.filter(i => i.enableToggleVisible).map(i => ({
    ...i,
    toggleVisible: () => { i.visible.value = i.visible.value === undefined ? false : !i.visible.value },
  }))
  return { allColumns, visibleColumns, toggleVisibleColumns, filterExpr: filterExprValue }
}

export function useTypeTableOnSorterChange(query: MaybeRef<{ sort?: Array<string> | undefined | null }>) {
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

    const q = (isRef(query) ? query.value : query) || { sort: [] }

    const index = findIndex(
      q.sort,
      o => o.startsWith(dataIndex),
    )

    if (!q.sort) {
      q.sort = []
    }
    // 找到已有的
    if (index !== -1) {
      // 有新值
      if (newValue) {
        q.sort[index] = newValue
      }
      else { // 移除已有的
        remove(q.sort, removeCondition)
      }
    }
    // 没有已有的
    else {
      q.sort.push(newValue!)
    }
  }

  return handle
}
