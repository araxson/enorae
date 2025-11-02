
import { assignRole as assignRoleAction } from './assign-role'
import { bulkAssignRoles as bulkAssignRolesAction } from './bulk-assign-roles'
import { updateRolePermissions as updateRolePermissionsAction } from './update-role-permissions'
import { revokeRole as revokeRoleAction } from './revoke-role'
import { deleteRole as deleteRoleAction } from './delete-role'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => Promise<Awaited<ReturnType<T>>>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return ((...args) => action(...args)) as ServerAction<T>
}

export const assignRole = createServerActionProxy(assignRoleAction)
export const bulkAssignRoles = createServerActionProxy(bulkAssignRolesAction)
export const updateRolePermissions = createServerActionProxy(updateRolePermissionsAction)
export const revokeRole = createServerActionProxy(revokeRoleAction)
export const deleteRole = createServerActionProxy(deleteRoleAction)

export type { RoleActionResponse, RoleType } from '../../types'
