import { client } from '~/api/v1_1/client.gen'
import * as apiV1SDK from '~/api/v1_1/sdk.gen'

export function useApiV1Client() {
  const config = useRuntimeConfig()

  client.setConfig({
    baseUrl: config.public.apiV1Base,
    credentials: 'include',
  })

  return { ...apiV1SDK }
}
