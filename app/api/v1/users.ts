import { apiV1 } from '.'

export type APIGetUsersParams = Y<Parameters<typeof apiV1['/users']['GET']>['0']>

export function getUsers(params: APIGetUsersParams) {
  return apiV1['/users'].GET(params)
}

export function deleteUser(userId: any) {
  return apiV1['/users/{user_id}'].DELETE({
    params: { path: { user_id: userId } },
  })
}

export type APICreateUserParams = Y<Parameters<typeof apiV1['/users']['POST']>['0']>

export function createUser(params: APICreateUserParams) {
  return apiV1['/users'].POST(params)
}
