import type { paths } from '~/api/v1/types'
import createClient, { type Middleware, wrapAsPathBasedClient } from 'openapi-fetch'

const middleware: Middleware = {
  onRequest: async ({ schemaPath, request }) => {
    const auth = useAuth()

    if (!/\/oauth\/token$/.test(schemaPath) && auth.isLogged) {
      request.headers.set('Authorization', `${auth.accessTokenType} ${auth.accessToken}`)
    }

    return request
  },
}
const client = createClient<paths>({
  baseUrl: '/api',
})
export const apiV1 = wrapAsPathBasedClient(client)
client.use(middleware)

// 工具类型

// 提取查询参数
type _Queries<T> = T extends { params?: { query?: infer Value } | undefined } ? Value : T
export type APIQuery<T> = T extends (params: infer Params) => any ? _Queries<Params> : _Queries<T>

// 提取查询参数里的排序参数
export type APIQuerySort<T> = APIQuery<T> extends { sorts?: infer Value } ? Exclude<Value, undefined | null> : T

// 提取分页结果
type _Result<T> = UnVueMaybeRef<T> extends {
  data?: { results: (infer DataResultsItem)[] }
} ? DataResultsItem : T extends {
    results: (infer DataResultsItem)[]
  } ? DataResultsItem : T
export type APIResult<T> = T extends (...params: any) => Promise<infer Res> ? _Result<Res> : _Result<T>

export function getCSRFToken() {
  return client.GET('/auth/csrf-token')
}
