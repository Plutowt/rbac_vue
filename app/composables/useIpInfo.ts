export const useIpInfo = defineStore('ip-info', () => {
  const iso = ref<ISO3166_1_Alpha_2>()
  async function refresh() {
    const res = await fetchIpApiCo()
    iso.value = res.country_code
  }

  return { iso, refresh }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIpInfo, import.meta.hot))
}
