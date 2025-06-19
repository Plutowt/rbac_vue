// 控制是否能调整到页面
export default defineNuxtRouteMiddleware(
  async (to) => {
    const auth = useAuth()
    const localePath = useLocalePath()
    const loginPath = localePath({ name: 'auth-login', query: { next: to.path } })

    const requires = to.meta.permissions
    // 如果页面声明了权限
    if (requires?.length) {
      // 如果没登陆 并且刷新 token 失败
      if (!auth.isLogged && !await auth.refreshTokens()) {
        return await navigateTo(loginPath)
      }

      if (auth.info) {
        const userPermissions = auth.info.permissions
        // 只要具备任意一项权限就可跳转
        if (requires.some(i => userPermissions.includes(i))) {
          return
        }

        return await navigateTo(localePath('forbidden'))
      }

      return await navigateTo(loginPath)
    }
  },
)
