export default defineNuxtRouteMiddleware(
  async (to) => {
    const auth = useAuth()
    const localePath = useLocalePath()
    const loginPath = localePath({ name: 'auth-login', query: { next: to.path } })
    // 如果没登陆 并且刷新 用户信息 失败
    if (!auth.isLogged && !await auth.refreshUserInfo()) {
      return await navigateTo(loginPath)
    }
  },
)
