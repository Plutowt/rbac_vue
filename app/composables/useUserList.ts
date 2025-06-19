import type { WatchCallback, WatchOptions, WatchSource } from 'vue'
import type { APIUserPageQueryModel } from '~/api/v1/users'
import { getUserPage } from '~/api/v1/users'

export function useUserList(opts?: { watch?: [WatchSource, WatchCallback] | [WatchSource, WatchCallback, WatchOptions] }) {
  const options = reactive<{ label: string, value: number }[]>([])
  const max = ref<number>()
  const auth = useAuth()

  const { params: pageParams, nextPage } = usePageParams({ max })
  const queryUserModel = reactive<APIUserPageQueryModel>({})
  const { data } = useAsyncData(
    async () => {
      if (auth.info?.role === 'admin') {
        return await getUserPage({ ...pageParams, ...queryUserModel })()
      }
    },
    {
      watch: [pageParams, queryUserModel],
    },
  )

  watchEffect(() => {
    const result = data.value?.result

    if (result) {
      max.value = result.pageCount
      if (result.pageNo === 1) {
        options.splice(0)
        options.push(...result.results.map(i => ({ label: i.username!, value: i.id })))
      }
      else {
        options.push(...result.results.map(i => ({ label: i.username!, value: i.id })))
      }
    }
  })

  if (opts?.watch) {
    const source = opts.watch[0]
    const callback = opts.watch[1]
    watch(source, callback, opts.watch[2])
  }

  return { options, queryUserModel, pageParams, nextPage }
}
