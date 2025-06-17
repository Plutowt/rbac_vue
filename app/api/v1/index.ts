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
