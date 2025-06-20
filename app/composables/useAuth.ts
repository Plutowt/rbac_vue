import type { components } from '~/api/v1/types'
import { serialize } from 'object-to-formdata'
import { defineStore } from 'pinia'
import { apiV1 } from '~/api/v1'
import { clientId } from '~/constants'

const clientInfo = btoa(`${clientId}:_`)
const Authorization = `Basic ${clientInfo}`

export const useAuth = defineStore('auth', () => {
  const { t } = useNuxtApp().$i18n
  const localePath = useLocalePath()

  const info = ref<components['schemas']['APIUserInfo']>()

  const accessTokenType = ref<string>()
  const accessToken = ref<string>()
  const isLogged = computed(() => !!accessToken.value)

  const remember = useLocalStorage<boolean>('remember', false)

  const loading = ref(false)
  const errorMessage = ref('')
  async function refreshTokens() {
    const { error, data } = await apiV1['/oauth/token'].POST({
      body: {
        grant_type: 'refresh_token',
        refresh_token: '.',
      },
      bodySerializer: serialize,
      headers: { Authorization },
    })

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
  } = useTimeoutFn(refreshTokens, autoRefreshInterval, { immediate: false })

  function clear() {
    info.value = undefined
    accessToken.value = undefined
  }

  async function initial(tokens: components['schemas']['TokenPair']) {
    // access token 过期时间一分钟前
    if (remember.value) {
      autoRefreshInterval.value = (tokens.expires_in - 60) * 1e3
      startAutoRefresh()
    }
    accessTokenType.value = tokens.token_type
    accessToken.value = tokens.access_token
    const { data } = await apiV1['/userinfo'].GET()
    if (data) {
      info.value = data
    }
  }

  async function login(credentials: components['schemas']['APILoginCredentials']) {
    loading.value = true
    const query = {
      client_id: clientId,
      redirect_uri: window.location.href,
    }

    const { error, response } = await apiV1['/authenticate'].POST({
      // redirect: 'manual',
      body: credentials,
      bodySerializer: serialize,
      parseAs: 'text',
      params: { query },
    })

    if (error) {
      // 这里出现时应该是 clientId 不匹配或者没有提交 redirect_uri 参数
      Message.error(t('common.unknownServerError'))
    }
    else {
      const url = new URL(response.url)
      // 重定向 url 错误, 或者用户名密码错误。
      // 由于重定向 url 应该和当前 url 是一致的, 不可能错误, 所以只可能是用户名或者密码错误
      if (url.searchParams.get('error')) {
        errorMessage.value = t('validation.InvalidCredentials')
      }
      else {
        const code = url.searchParams.get('code')!
        const { data, error, response } = await apiV1['/oauth/token'].POST({
          headers: { Authorization },
          body: {
            ...query,
            grant_type: 'authorization_code',
            code,
          },
          bodySerializer: serialize,
        })

        if (error) {
          if (response.status === 429) {
            Message.error(t('validation.rateLimit'))
          }
          else {
            Message.error(t('common.unknownServerError'))
          }
        }
        else {
          await initial(data!)

          const route = useRoute()
          let next: string
          if (route.query.next)
            next = localePath({ path: route.query.next.toString() })
          else
            next = localePath('index')
          await navigateTo(next)
        }
      }
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

  return { info, accessToken, accessTokenType, refreshTokens, remember, isLogged, login, logout, clear, error: errorMessage, clearError, loading }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
