export function isNumber(value: string) {
  const num = Number.parseFloat(value)
  return !Number.isNaN(num) && Number.isFinite(num)
}

export function eq<T>(a: T | undefined, b: T | undefined, key: keyof T | undefined) {
  return key !== undefined ? a?.[key] === b?.[key] : a === b
}

export function findBy<T>(results: T[], target: T, by: keyof T | undefined): [false, -1, undefined]
export function findBy<T>(results: T[], target: T, by: keyof T | undefined): [true, number, T]
export function findBy<T>(results: T[], target: T, by: keyof T | undefined): [boolean, number, T | undefined] {
  const valueIndex = results.findIndex(i => eq(i, target, by))
  return [valueIndex > -1, valueIndex, results?.[valueIndex]]
}

/**
 * 取相交值
 */
export function intersect<A extends object, B extends A>(
  target: A[],
  source: B[],
  by: keyof A,
): [A, B][] {
  const results: [A, B][] = []
  target.forEach((i) => {
    const ii = source.find(ii => i[by] === ii[by])
    if (ii)
      results.push([i, ii])
  })

  return results
}

/**
 * 取独占值
 */
export function exclusive<A extends B, B extends object>(
  target: A[],
  source: B[],
  by: keyof B,
): A[] {
  return target.filter(i => !source.some(ii => i[by] === ii[by]))
}

/**
 * 判断 array1 是否是 array2 的一部分
 * @param array1 数组1
 * @param array2 数组2
 * @param by 属性, 如果指定了此项, 那么将根据此项指定的属性名进行比较
 * @returns array1 是否是 array2 的一部分
 */
export function isSubset<T>(
  array1: T[],
  array2: T[],
  by: keyof T | undefined,
) {
  const set2 = new Set(array2.map(i => by !== undefined ? i[by] : i))
  return array1.map(i => by !== undefined ? i[by] : i).every(value => set2.has(value))
}

export function toArray<T>(value: T | T[] | undefined) {
  if (value === undefined)
    return []

  if (Array.isArray(value))
    return value

  return [value]
}

function title(value: string) {
  return value.length ? value.split(' ').map(i => i[0]?.toUpperCase() + i.slice(1)).join(' ') : ''
}

export const string = { title }

// 貌似用不了
// export function syncValues<
//   T extends Record<string, any>,
//   T2 extends Record<string, any>,
// >(
//   state: MaybeRef<T>,
//   syncObject: MaybeRef<T2>,
//   syncMap: Record<keyof T, keyof T2>,
// ) {
//   const watchers: WatchHandle[] = []
//   Object.entries(syncMap).forEach(([stateKey, syncKey]) => {
//     watchers.push(
//       watch(
//         () => unref(state)[stateKey],
//         (n) => {
//           unref(syncObject)[syncKey] = n
//         },
//         { immediate: true },
//       ),
//     )
//   })
//   return watchers
// }

export function exportCSV(options: {
  header: string[]
  data: any[][]
  filename: string
}) {
  const header = options.header
  const csv = [header, ...options.data].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = options.filename
  a.click()
  URL.revokeObjectURL(url)
}

export function list<T>(source: ArrayLike<T>): { value: T, index: number }[] {
  return Array.from({ length: source.length }, (_, index) => ({ value: source[index]!, index }))
}

export function createValidArrayHandle<
  ArrayT,
  FnT extends () => void,
>(array: MaybeRef<ArrayT[] | undefined>, fn: FnT) {
  return () => {
    if (unref(array)?.length)
      return fn()
  }
}

// export function validateNumber(route: RouteLocationNormalized) {
//   const params = route.params as { id?: unknown }
//   return !!(params?.id && !Number.isNaN(Number(params.id)))
// }

export function uniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
