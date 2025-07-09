import type { WatchCallback, WatchOptions, WatchSource } from 'vue'
import type { UserGetPageData } from '~/api/v1_1'

export function useUserList(opts?: { watch?: [WatchSource, WatchCallback] | [WatchSource, WatchCallback, WatchOptions] }) {
  const options = reactive<{ label: string, value: number }[]>([])

  const { userGetPage } = useApiV1Client()
  const { no, size, nextPage, max } = usePageParams()
  const query = reactive<Y<UserGetPageData['query']>>({})
  const { data } = useAsyncData(
    async () => {
      if (useHasAnyPermission('users', 'users:read')) {
        return await userGetPage({ query: { pageNo: no.value, pageSize: size.value, ...query } })
      }
    },
    {
      watch: [no, size, query],
    },
  )

  watchEffect(() => {
    const result = data.value?.data

    if (result) {
      max.value = result.pageCount
      if (result.pageNo === 1) {
        options.splice(0)
        options.push(...result.results.map(i => ({ label: i.username, value: i.id })))
      }
      else {
        options.push(...result.results.map(i => ({ label: i.username, value: i.id })))
      }
    }
  })

  if (opts?.watch) {
    const source = opts.watch[0]
    const callback = opts.watch[1]
    watch(source, callback, opts.watch[2])
  }

  return { options, queryUserModel: query, no, size, nextPage }
}
