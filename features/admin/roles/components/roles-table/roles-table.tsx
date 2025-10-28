'use client'

import type { UserRole } from '@/lib/types'
import { RolesTableContent } from './table'
import { DeleteRoleDialog, RevokeRoleDialog } from './dialogs'
import { useRoleActions } from './use-role-actions'
import { EditPermissionsDialog } from '@/features/admin/roles/components/edit-permissions-dialog'

export type RolesTableProps = {
  roles: UserRole[]
  canDelete?: boolean
}

export function RolesTable({ roles, canDelete = false }: RolesTableProps) {
  const {
    state: { targetRole, action, isLoading, editRole },
    openRevokeDialog,
    openDeleteDialog,
    openEditDialog,
    closeDialog,
    closeEditDialog,
    handleRevoke,
    handleDelete,
  } = useRoleActions()

  return (
    <>
      <RolesTableContent
        roles={roles}
        canDelete={canDelete}
        onRevoke={openRevokeDialog}
        onDelete={openDeleteDialog}
        onEditPermissions={openEditDialog}
      />

      <RevokeRoleDialog
        open={action === 'revoke'}
        onOpenChange={(open) => !open && closeDialog()}
        isLoading={isLoading}
        onConfirm={handleRevoke}
        role={targetRole}
      />

      <DeleteRoleDialog
        enabled={canDelete}
        open={action === 'delete'}
        onOpenChange={(open) => !open && closeDialog()}
        isLoading={isLoading}
        onConfirm={handleDelete}
      />

      <EditPermissionsDialog
        role={editRole}
        open={Boolean(editRole)}
        onOpenChange={(open) => {
          if (!open) closeEditDialog()
        }}
      />
    </>
  )
}
