// import type { MessageConfig } from '@arco-design/web-vue'
// import { FetchError } from 'ofetch'

// interface APIError<ErrorData extends { code: string } = { code: string, target?: string }> {
//   error: ErrorData & { message: string }
// }

// type MessageData = string | MessageConfig

// interface RetryResult<T = unknown> { result?: T, message?: MessageData }

// interface ErrorHandleMap<
//   ErrorData extends { code: string } = { code: string, target?: string },
//   T = unknown,
// > {
//   [k: number]: (options: APIError<ErrorData> & {
//     requestFn: () => Promise<T | undefined>
//     requestId: string
//   }) => RetryResult<T> | void | Promise<RetryResult<T> | void>
// }

// const defaultErrorHandles: ErrorHandleMap = {
//   401: async ({ requestFn, requestId }) => {
//     const reqId = useRequestId()
//     reqId.value = requestId
//     const result: RetryResult<unknown> = { }

//     const auth = useAuth()
//     auth.token = undefined

//     if (auth.refreshToken) {
//       await useApi<unknown, { code: 'InvalidRefreshToken' }>(
//         // 刷新令牌
//         auth.refreshTokens,
//         {
//           // 刷新成功, 重新执行
//           onSuccess: async () => {
//             result.result = await requestFn()
//           },
//           errorHandles: {
//             400: async ({ error }) => {
//               if (error.code === 'InvalidRefreshToken') {
//                 await useAuth().logout()
//               }
//             },
//           },
//         },
//       ).fetcher()
//     }

//     return result
//   },
//   404: () => ({ message: useNuxtApp().$i18n.t('validation.NotFound') }),
//   403: () => ({ message: useNuxtApp().$i18n.t('validation.permissionForbidden') }),
//   409: ({ error }) => {
//     const { t } = useNuxtApp().$i18n
//     return { message: t('validation.server.Conflict', { target: t(`common.${error.target ?? 'resource'}`) }) }
//   },
//   429: () => ({ message: useNuxtApp().$i18n.t('validation.rateLimit') }),
//   500: () => ({ message: useNuxtApp().$i18n.t('validation.serverError') }),
// }

// async function errorHandle<
//   ErrorData extends { code: string } = { code: string, target?: string },
//   T = unknown,
// >(
//   error: FetchError<APIError<ErrorData>>,
//   errorHandles: ErrorHandleMap<ErrorData, T>,
//   disableErrorHandles: (keyof typeof defaultErrorHandles)[],
//   requestFn: () => Promise<T | undefined>,
// ): Promise<T | undefined> {
//   disableErrorHandles?.forEach(i => delete errorHandles[i])

//   const { runWithContext, $i18n } = useNuxtApp()
//   const { t } = $i18n

//   async function logError(message?: MessageData) {
//     await runWithContext(() => {
//       Message.error(message ?? t('common.actionFailure'))
//     })
//   }

//   if (error.status === undefined) {
//     await logError(t('validation.server.ServerError'))
//     return
//   }

//   const fn = errorHandles[error.status]

//   if (fn !== undefined) {
//     const result = await fn({ error: error.data!.error, requestFn, requestId: error.response!.headers.get('x-request-id')! })

//     if (result) {
//       if (Object.hasOwn(result, 'result'))
//         return result.result as T | undefined
//       else if (Object.hasOwn(result, 'message'))
//         await logError(result.message)
//     }
//   }
// }

// export type useApiStatus = 'success' | 'pending' | 'failure' | undefined

// export function useApi<
//   Success,
//   ErrorData extends { code: string } = { code: string, target?: string },
// >(
//   requestFn: () => Promise<Success>,
//   options?: {
//     onSuccess?: (response: Success) => Promise<void> | void
//     onFailure?: (response: FetchError<APIError<ErrorData>>) => void | Promise<void>
//     errorHandles?: ErrorHandleMap<ErrorData, Success>
//     disableErrorHandles?: (keyof typeof defaultErrorHandles)[]
//   },
// ) {
//   const status = ref<useApiStatus>()

//   const fetcher = async () => {
//     let result: Success | undefined

//     if (status.value === 'pending')
//       return

//     status.value = 'pending'

//     try {
//       result = await requestFn()

//       if (options?.onSuccess)
//         await options.onSuccess(result)

//       status.value = 'success'
//     }
//     catch (error) {
//       if (error instanceof FetchError) {
//         result = await errorHandle<ErrorData, Success>(
//           error,
//           { ...defaultErrorHandles, ...options?.errorHandles } as ErrorHandleMap<ErrorData, Success>,
//           options?.disableErrorHandles ?? [],
//           requestFn,
//         )

//         if (result) {
//           status.value = 'success'
//           return result
//         }

//         if (typeof options?.onFailure === 'function') {
//           await options.onFailure(error)
//         }
//       }

//       status.value = 'failure'
//     }
//     finally {
//       const reqId = useRequestId()
//       reqId.value = undefined
//     }

//     return result
//   }
//   return { fetcher, status, is: {
//     success: computed(() => status.value === 'success'),
//     pending: computed(() => status.value === 'pending'),
//     failure: computed(() => status.value === 'failure'),
//   } }
// }
