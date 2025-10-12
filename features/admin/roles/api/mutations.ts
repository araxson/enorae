'use server'

export { assignRole } from './role-mutations/assign-role'
export { bulkAssignRoles } from './role-mutations/bulk-assign-roles'
export { updateRolePermissions } from './role-mutations/update-role-permissions'
export { revokeRole } from './role-mutations/revoke-role'
export { deleteRole } from './role-mutations/delete-role'

export type { RoleActionResponse, RoleType } from './role-mutations/types'
