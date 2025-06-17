import type { components } from '~/api/v1'

export const accessTokenScopes: components['schemas']['AccessTokenScopes'][] = [
  'device:get',
  'device_location:get',
  'sms:post',
]
