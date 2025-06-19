export default defineNuxtRouteMiddleware(
  async (to) => {
    const auth = useAuth()
    const localePath = useLocalePath()
    const loginPath = localePath({ name: 'auth-login', query: { next: to.path } })
    // 如果没登陆 并且刷新 token 失败
    if (!auth.isLogged && !await auth.refreshTokens()) {
      return await navigateTo(loginPath)
    }
  },
)
