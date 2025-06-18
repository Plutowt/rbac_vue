export default defineNuxtRouteMiddleware(
  async (to) => {
    const auth = useAuth()

    if (to.meta.layout === 'dashboard' && !auth.isLogged) {
      if (!await auth.refreshTokens()) {
        const localePath = useLocalePath()
        return await navigateTo(localePath({ name: 'auth-login', query: { next: to.path } }))
      }
    }

    // async function checkPermission() {
    //   if (auth.info) {
    //     // TODO
    //     // 单个 permission 以对象形式
    //     // { value: "类似 code", condition: "条件(以当前环境)" }
    //     if (to.meta.roles && !to.meta.roles.includes(auth.info))
    //       return await navigateTo(localePath('forbidden'))
    //   }
    //   else {
    //     return await auth.logout()
    //   }
    // }

    // // 如果不是去登录界面
    // if (to.meta.layout !== 'auth') {
    //   // 已经登录, 重新获取用户信息
    //   if (auth.isLogged) {
    //     await auth.refreshInfo()
    //   }
    //   else {
    //     const { fetcher } = useApi<unknown, { code: 'InvalidRefreshToken' }>(
    //       () => auth.refreshTokens(),
    //       {
    //         onSuccess: () => auth.refreshInfo(),
    //         errorHandles: {
    //           400: async ({ error }) => {
    //             if (error.code === 'InvalidRefreshToken')
    //               result = await auth.logout()
    //           },
    //         },
    //       },
    //     )
    //     await fetcher()
    //   }

    //   if (!result)
    //     result = await checkRole()
    // }

    // if (result) {
    //   return result
    // }
  },
)
