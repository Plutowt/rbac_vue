import type { PermissionCode } from '~/api/v1_1'

export function useHasAnyPermission(...code: PermissionCode[]) {
  const auth = useAuth()
  return code.some(i => auth.info?.permissions.includes(i))
}

export function useHasAllPermissions(...code: PermissionCode[]) {
  const auth = useAuth()
  return code.every(i => auth.info?.permissions.includes(i))
}
