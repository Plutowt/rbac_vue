import type { SelectProps, TableColumnData, TableData, TableFilterable } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'
import type { UserRole } from '~/api/v1/users'
import UITableFilterNumber from '~/components/UI/Table/Filter/Number.vue'
import UITableFilterSelect from '~/components/UI/Table/Filter/Select.vue'
import UITableFilterString from '~/components/UI/Table/Filter/String.vue'
import UITableFilterTreeSelect from '~/components/UI/Table/Filter/TreeSelect.vue'

export type FieldType = 'string' | 'datetime' | 'number' | 'select' | 'tree-select'

export interface FilterExpr<ResultT> {
  field: Paths<ResultT>
  clause?: string
  type: FieldType
  label: string
  [k: string]: any
}

type _Data = Omit<Parameters<Y<TableColumnData['render']>>[0], 'record'>
type _Record<T> = TableData & T

type CustomTableFilterable<T> = Omit<TableFilterable, 'filter'> & {
  filter?: (filteredValue: string[], record: _Record<T>) => boolean
}

type CustomTableColumnData<
  ResultT,
  FilterModelT = { [k: string]: unknown },
> = (Omit<TableColumnData, 'render' | 'filterable'> & {
  dataIndex?: Paths<ResultT>
  filterable?: CustomTableFilterable<ResultT> | true
  onFilterReset?: () => void
  onFilterConfirm?: (value: any) => void
  filterModel?: FilterModelT
  render?: (data: _Data & { record: _Record<ResultT> }) => ReturnType<Exclude<TableColumnData['render'], undefined>>
})

export function typeColumns<T>(columns: CustomTableColumnData<T>[]) {
  return columns as TableColumnData[]
}

interface Condition {
  show?: boolean
  condition?: () => boolean
  roles?: UserRole[]
}

interface ColumnExtraData extends Omit<SelectProps, 'options'> {
  hidden?: boolean
  sort?: boolean
  filter?: boolean
  /**
   * 如果要使用高级过滤器, 还需设置 `dataIndex` 和 `type` 字段的值
   */
  advancedFilter?: boolean
  type?: FieldType
  icon?: string
  options?: MaybeRef<{ label: string, value: unknown }[]>
  onDropdownReachBottom?: ((ev: Event) => any) | undefined
  width?: string | number | null
  [k: string]: unknown
}

export type UseColumns<
  T,
  T2 = { [k: string]: unknown },
> = (CustomTableColumnData<T, T2> & Condition & ColumnExtraData)[]

export function useColumns<
  T,
  T2 = { [k: string]: unknown },
  Sorts extends string[] = string[],
>(
  columns: MaybeRef<UseColumns<T, T2>>,
  opts?: { filterModel?: T2 },
) {
  const auth = useAuth()
  const columns_ = computed(
    () =>
      Array
        .from(
          isRef(columns) ? columns.value : columns,
          (v, _index) => {
            const k = (v.dataIndex || v.slotName)
            const width = v.type === 'datetime' ? 250 : 150

            if (!v.filterable) {
              return { width, ...v, _index }
            }
            else {
              return {
                width,
                ...v,
                _index,
                filterable: (
                  v.filterable === true
                    ? {
                        renderContent: (data: {
                          filterValue: Ref<string[]>
                          setFilterValue: (filterValue: string[]) => void
                          handleFilterConfirm: (event: Event) => void
                          handleFilterReset: (event: Event) => void
                        }) => {
                          const onReset = v.onFilterReset || function () {
                            const fm = opts?.filterModel || v.filterModel

                            if (fm && v.dataIndex) {
                              delete fm[v.dataIndex as unknown as keyof T2]
                            }
                          }
                          const onConfirm = v.onFilterConfirm || function (v) {
                            const fm = opts?.filterModel || v.filterModel
                            if (fm && v.dataIndex) {
                              fm[v.dataIndex as unknown as keyof T2] = v
                            }
                          }

                          const props = { ...data, ...v, onReset, onConfirm }

                          switch (v.type) {
                            case 'string':
                              return h(UITableFilterString, props as any)

                            case 'select':

                              return h(UITableFilterSelect, props as any)

                            case 'number':
                              return h(UITableFilterNumber, props as any)

                            case 'tree-select':
                              return h(UITableFilterTreeSelect, props as any)
                          }
                        },
                      }
                    : {
                        filter: () => true,
                        slotName: k && `${k}-filter`,
                        ...v.filterable,
                      }),
              }
            }
          },
        )
        .filter(
          (i) => {
            const valid = [true, undefined].includes(i.condition?.())
            const validRole = (auth.info && i.roles?.includes(auth.info.role))
            const unsetRole = i.roles === undefined

            return valid && (validRole || unsetRole)
          },
        ),
  )

  /**
   * 取要显示的列
   * 要求是列指定固定(fixed)参数, 或者没有显式指定 show 为 false
   */
  function getDisplay(n?: typeof columns_.value) {
    return (n ?? columns_.value).filter(i => !i.hidden && (i.fixed || i.show !== false))
  }

  /**
   * 取能够作为选项的列
   * 要求列不是固定(fixed)的
   */
  function getOptions(n?: typeof columns_.value) {
    return (n ?? columns_.value).filter(i => !i.hidden && !i.fixed)
  }

  /**
   * 当前显示的列
   */
  const display = ref(getDisplay())

  /**
   * 可以控制是否要显示的的列
   */
  const options = ref(getOptions())

  watch(columns_, (n) => {
    display.value = getDisplay(n)
    options.value = getOptions(n)
  })

  function toggle(i: UnPackArray<typeof columns_.value>) {
    // 查找当前项是否在显示的列中
    const index = display.value.findIndex(ii => ii._index === i._index)
    i.show = !(index > -1)
    display.value = getDisplay()
  }

  function enabled(i: UnPackArray<typeof columns_.value>) {
    return i.show === undefined || i.show
  }

  const sorts = reactive<Sorts>([] as any)

  const filters = ref<FilterExpr<T>[]>([])

  function query(extra?: any) {
    const clauses = filters.value.map(i => i.clause).filter(i => i)
    const filter = clauses.length ? clauses.join(' and ') : undefined
    return { filter, sorts: toValue(sorts), ...extra }
  }

  return {
    columns: display as unknown as Ref<TableColumnData[]>,
    column: { options, toggle, enabled },
    filters,
    filter: computed(() => {
      const clauses = filters.value.map(i => i.clause).filter(i => i)
      return clauses.length ? clauses.join(' and ') : undefined
    }),
    filterOptions: computed(() => columns_.value.filter(i => (i.advancedFilter === true) && i.dataIndex !== undefined && i.type !== undefined).map(i => ({
      field: i.dataIndex,
      type: i.type,
      label: i.title!,
      icon: i.icon,
      options: i?.options,
    })) as UIDataOption<T>[]),
    sorts,
    sortOptions: computed(() => columns_.value.filter(i => i.sort !== false && i.dataIndex !== undefined && i.type !== undefined).map(i => ({
      field: i.dataIndex,
      type: i.type,
      label: i.title!,
      icon: i.icon,
    })) as UIDataOption<T>[]),
    query,
  }
}
