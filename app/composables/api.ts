async function v1<T>(
  request: Parameters<typeof $fetch<T>>[0],
  options?: Parameters<typeof $fetch<T>>[1],
) {
  const conf = useRuntimeConfig()
  const auth = useAuth()

  const f = $fetch.create(
    {
      baseURL: conf.public.apiV1Base,
      timeout: 30e3,
      onRequest: (context) => {
        if (auth.accessToken)
          context.options.headers.set('Authorization', `Bearer ${auth.accessToken}`)

        const reqId = useRequestId().value
        if (reqId)
          context.options.headers.set('X-Request-ID', reqId)
      },
    },
  )
  return await f<T>(request, options)
}

export const $api = v1
