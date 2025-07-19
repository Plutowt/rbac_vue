import type { TreeNodeData } from '@arco-design/web-vue'
import type { PermissionCode } from '~/api/v1_1'

const _SEPARATOR = ':'

function getParents(code: PermissionCode) {
  const parts = code.split(_SEPARATOR)
  const results: PermissionCode[] = []
  for (let index = 1; index < parts.length; index++) {
    results.push(parts.slice(0, index).join(_SEPARATOR) as PermissionCode)
  }
  return results
}

/**
 *
 * @returns 返回当前用户所具有的权限
 */
export function useAuthPermissions(): Set<PermissionCode> {
  const auth = useAuth()

  if (auth.info) {
    const perms = auth.info.permissions as PermissionCode[]
    return new Set(perms)
  }
  return new Set()
}

function verify(perms: Set<PermissionCode>, code: PermissionCode) {
  if (perms.has(code))
    return true

  return getParents(code).some(parent => perms.has(parent))
}

/**
 *
 * @param code 所需任意权限
 * @returns 检查当前用户是否具备所需的任意权限
 */
export function useHasAnyPermission(...code: PermissionCode[]) {
  const perms = useAuthPermissions()

  return code.some(i => verify(perms, i))
}

/**
 *
 * @param code 所需权限
 * @returns 检查当前用户是否具备所需的所有权限
 */
export function useHasAllPermissions(...code: PermissionCode[]) {
  const perms = useAuthPermissions()

  return code.every(i => verify(perms, i))
}

export function allPermissions() {
  const { userPermissionGetAll } = useApiV1Client()
  const { data } = useAsyncData(async () => {
    if (useHasAllPermissions('permissions:read', 'users', 'roles')) {
      const { data } = await userPermissionGetAll()
      return data
    }
  })
  return data
}

interface _Tree { [k: string]: _Tree | null }

function parseTree(tree: _Tree) {
  const { t } = useNuxtApp().$i18n
  const results: TreeNodeData[] = []
  for (const key in tree) {
    const result: TreeNodeData = {}
    result.key = key
    result.title = t(`common.permissionCode.${key}`)
    const value = tree[key]
    if (value) {
      result.children = parseTree(value)
    }
    results.push(result)
  }
  return results
}

export function treePermissions(): ComputedRef<TreeNodeData[]> {
  const permission = allPermissions()

  return computed(() => {
    const tree: _Tree = {}

    const sorted = permission.value?.sort(
      (a, b) => a.code.split(_SEPARATOR).length - b.code.split(_SEPARATOR).length,
    ) || []

    for (const i of sorted) {
      const parts = i.code.split(_SEPARATOR)
      let current = tree

      for (let index = 0; index < parts.length; index++) {
        const k = parts.slice(0, index + 1).join(_SEPARATOR)

        if (permission.value?.findIndex(p => p.code === k) === -1)
          continue
        // 最后
        if (index === parts.length - 1) {
          if (!current[k])
            current[k] = null
        }
        else {
          if (!current[k]) {
            current[k] = {}
          }

          current = current[k]
        }
      }
    }

    const result = parseTree(tree)

    return result
  })
}
