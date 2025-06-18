export default defineNuxtRouteMiddleware(
  async (to) => {
    const auth = useAuth()
    const localePath = useLocalePath()
    const loginPath = localePath({ name: 'auth-login', query: { next: to.path } })

    // 如果页面声明了权限
    const requires = to.meta.permissions
    if (requires?.length) {
      // 如果没登陆 并且刷新 token 失败
      if (!auth.isLogged && !await auth.refreshTokens()) {
        return await navigateTo(loginPath)
      }

      if (auth.info) {
        const userPermissions = auth.info.permissions
        if (requires.some(i => userPermissions.includes(i))) {
          return to
        }

        return abortNavigation('Insufficient permissions.')
      }

      return await navigateTo(loginPath)
    }
  },
)
