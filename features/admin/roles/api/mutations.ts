'use server'

import { assignRole as assignRoleAction } from './role-mutations/assign-role'
import { bulkAssignRoles as bulkAssignRolesAction } from './role-mutations/bulk-assign-roles'
import { updateRolePermissions as updateRolePermissionsAction } from './role-mutations/update-role-permissions'
import { revokeRole as revokeRoleAction } from './role-mutations/revoke-role'
import { deleteRole as deleteRoleAction } from './role-mutations/delete-role'

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const assignRole = createServerActionProxy(assignRoleAction)
export const bulkAssignRoles = createServerActionProxy(bulkAssignRolesAction)
export const updateRolePermissions = createServerActionProxy(updateRolePermissionsAction)
export const revokeRole = createServerActionProxy(revokeRoleAction)
export const deleteRole = createServerActionProxy(deleteRoleAction)

export type { RoleActionResponse, RoleType } from './role-mutations/types'
