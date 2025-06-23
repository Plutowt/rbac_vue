import type { PermissionCode } from '~/api/v1'

export function checkPermissions(permissions: PermissionCode[]) {
  const auth = useAuth()

  return permissions.every((i) => {
    if (!auth.info)
      return false

    return auth.info.permissions.includes(i)
  })
}
