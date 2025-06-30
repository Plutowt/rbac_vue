import type { components } from '~/api/v1/types'
import { serialize } from 'object-to-formdata'
import { defineStore } from 'pinia'
import { apiV1 } from '~/api/v1'
import { autoRefreshIntervalSeconds } from '~/constants'

export const useAuth = defineStore('auth', () => {
  const { t } = useNuxtApp().$i18n
  const localePath = useLocalePath()

  const info = ref<components['schemas']['APIUserInfo']>()

  const isLogged = computed(() => !!info.value)

  const remember = useLocalStorage<boolean>('remember', false)

  const loading = ref(false)
  const errorMessage = ref('')
  async function refreshUserInfo() {
    const { error, data } = await apiV1['/user'].GET()

    if (error) {
      const route = useRoute()
      const localePath = useLocalePath()
      await navigateTo(localePath({ name: 'auth-login', query: { next: route.path } }))
      return false
    }
    else {
      await initial(data)
      return true
    }
  }
  /**
   * 自动刷新的时间
   * 只有在登陆时设置了 remember 才会刷新
   */
  const autoRefreshInterval = ref<number>(3e3)
  const {
    start: startAutoRefresh,
  } = useTimeoutFn(
    refreshUserInfo,
    autoRefreshInterval,
    { immediate: false },
  )

  function clear() {
    info.value = undefined
  }

  async function initial(data: components['schemas']['APIUserInfo']) {
    autoRefreshInterval.value = autoRefreshIntervalSeconds
    info.value = data
    startAutoRefresh()
  }

  async function login(credentials: components['schemas']['APILegacyLoginCredentials']) {
    loading.value = true

    const { error, data } = await apiV1['/auth/login'].POST({
      body: credentials,
      bodySerializer: serialize,
    })

    if (error) {
      // 这里出现时应该是 clientId 不匹配或者没有提交 redirect_uri 参数
      Message.error(t('validation.InvalidCredentials'))
    }
    else {
      await initial(data)

      const route = useRoute()
      let next: string
      if (route.query.next)
        next = localePath({ path: route.query.next.toString() })
      else
        next = localePath('index')
      await navigateTo(next)
    }

    loading.value = false
  }

  async function logout() {
    clear()

    const route = useRoute()
    const localePath = useLocalePath()
    return await navigateTo(localePath({ name: 'auth-login', query: { next: route.path } }))
  }

  function clearError() {
    errorMessage.value = ''
  }

  return {
    info,
    refreshUserInfo,
    remember,
    isLogged,
    login,
    logout,
    clear,
    error: errorMessage,
    clearError,
    loading,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
