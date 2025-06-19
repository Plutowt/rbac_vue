import { apiV1 } from '.'

export type APIGetUsersParams = Exclude<Parameters<typeof apiV1['/users']['GET']>['0'], undefined>

export function getUsers(params: APIGetUsersParams) {
  return apiV1['/users'].GET(params)
}
