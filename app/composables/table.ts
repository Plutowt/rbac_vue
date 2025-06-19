// import type { SelectProps, TableColumnData, TableData, TableFilterable } from '@arco-design/web-vue'
// import type { Paths } from 'type-fest'

// export type FieldType = 'string' | 'datetime' | 'number' | 'select' | 'tree-select'

// type _Data = Omit<Parameters<Y<TableColumnData['render']>>[0], 'record'>
// type _Record<T> = TableData & T

// type CustomTableColumnData<
//   ResultT,
// > = (Omit<TableColumnData, 'render' | 'filterable'> & {
//   dataIndex?: Paths<ResultT>
//   render?: (data: _Data & { record: _Record<ResultT> }) => ReturnType<Exclude<TableColumnData['render'], undefined>>
// })

// export function typeColumns<T>(columns: CustomTableColumnData<T>[]) {
//   return columns as TableColumnData[]
// }

// interface Condition {
//   /** 展示条件 */
//   condition?: () => boolean
// }

// interface ColumnSettings {
//   /** 是否隐藏 */
//   hidden?: boolean
//   /** 是否可排序 */
//   sort?: boolean
//   /** 是否启用过滤器 */
//   filter?: boolean
//   type?: FieldType
//   icon?: string
//   options?: MaybeRef<{ label: string, value: unknown }[]>
//   /** 对于选择列, 拖动到最下方 */
//   onDropdownReachBottom?: ((ev: Event) => any) | undefined
//   /** 列宽度 */
//   width?: string | number | null
//   [k: string]: unknown
// }

// export type UseColumns<
//   T,
//   T2 = { [k: string]: unknown },
// > = (CustomTableColumnData<T, T2> & Condition & ColumnSettings)[]

// export function useColumns<
//   T,
//   T2 = { [k: string]: unknown },
//   Sorts extends string[] = string[],
// >(
//   columns: MaybeRef<UseColumns<T, T2>>,
//   opts?: { filterModel?: T2 },
// ) {
//   const auth = useAuth()

//   /**
//    * 取要显示的列
//    * 要求是列指定固定(fixed)参数, 或者没有显式指定 show 为 false
//    */
//   function getDisplay(n?: typeof columns_.value) {
//     return (n ?? columns_.value).filter(i => !i.hidden && (i.fixed || i.visiable !== false))
//   }

//   /**
//    * 取能够作为选项的列
//    * 要求列不是固定(fixed)的
//    */
//   function getOptions(n?: typeof columns_.value) {
//     return (n ?? columns_.value).filter(i => !i.hidden && !i.fixed)
//   }

//   /**
//    * 当前显示的列
//    */
//   const display = ref(getDisplay())

//   /**
//    * 可以控制是否要显示的的列
//    */
//   const options = ref(getOptions())

//   watch(columns_, (n) => {
//     display.value = getDisplay(n)
//     options.value = getOptions(n)
//   })

//   function toggle(i: UnPackArray<typeof columns_.value>) {
//     // 查找当前项是否在显示的列中
//     const index = display.value.findIndex(ii => ii._index === i._index)
//     i.visiable = !(index > -1)
//     display.value = getDisplay()
//   }

//   function enabled(i: UnPackArray<typeof columns_.value>) {
//     return i.visiable === undefined || i.visiable
//   }

//   const sorts = reactive<Sorts>([] as any)

//   const filters = ref<FilterExpr<T>[]>([])

//   function query(extra?: any) {
//     const clauses = filters.value.map(i => i.clause).filter(i => i)
//     const filter = clauses.length ? clauses.join(' and ') : undefined
//     return { filter, sorts: toValue(sorts), ...extra }
//   }

//   return {
//     columns: display as unknown as Ref<TableColumnData[]>,
//     column: { options, toggle, enabled },
//     filters,
//     filter: computed(() => {
//       const clauses = filters.value.map(i => i.clause).filter(i => i)
//       return clauses.length ? clauses.join(' and ') : undefined
//     }),
//     filterOptions: computed(() => columns_.value.filter(i => (i.advancedFilter === true) && i.dataIndex !== undefined && i.type !== undefined).map(i => ({
//       field: i.dataIndex,
//       type: i.type,
//       label: i.title!,
//       icon: i.icon,
//       options: i?.options,
//     })) as UIDataOption<T>[]),
//     sorts,
//     sortOptions: computed(() => columns_.value.filter(i => i.sort !== false && i.dataIndex !== undefined && i.type !== undefined).map(i => ({
//       field: i.dataIndex,
//       type: i.type,
//       label: i.title!,
//       icon: i.icon,
//     })) as UIDataOption<T>[]),
//     query,
//   }
// }
