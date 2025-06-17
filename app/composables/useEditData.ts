import { cloneDeep } from 'es-toolkit/object'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

export function useEditData<T extends { [k: string]: any }, RT = any>(
  fn: (diff: DeepPartial<T>) => any,
  options?: {
    key: keyof T
    item?: (current: T, result: RT) => string
  },
) {
  const currentEdit = ref<T>()
  const editData = ref<T>({} as T)

  watch(currentEdit, (n) => {
    editData.value = n ? cloneDeep(n) : {}
  })

  function editing(i: T) {
    const k = options?.key
    const current = currentEdit.value

    return k ? i[k] === current?.[k] : i === current
  }

  const tmp = ref()

  const { status, fetcher } = useApi(
    async () => {
      tmp.value = undefined
      if (currentEdit.value) {
        const data = diff(editData.value, currentEdit.value)

        if (data.is) {
          const result = await fn(JSON.parse(JSON.stringify(data.data)))
          tmp.value = result
          return result
        }
      }
    },
  )

  return { currentEdit, editData, editing, submitEditStatus: status, submitEdit: fetcher }
}
