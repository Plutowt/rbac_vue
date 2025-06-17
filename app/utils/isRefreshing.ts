import type { AsyncDataRequestStatus } from 'nuxt/app'

export function isRefreshing({ data, status }: { data: Ref<unknown>, status: Ref<AsyncDataRequestStatus> }) {
  const initialed = ref(false)
  watch(data, () => {
    initialed.value = true
  })

  return computed(() => initialed.value && status.value === 'pending')
}
