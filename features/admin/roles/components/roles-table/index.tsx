'use client'

import type { UserRole } from '@/lib/types/app.types'
import { RolesTableContent } from './table'
import { DeleteRoleDialog, RevokeRoleDialog } from './dialogs'
import { useRoleActions } from './use-role-actions'

export type RolesTableProps = {
  roles: UserRole[]
  canDelete?: boolean
}

export function RolesTable({ roles, canDelete = false }: RolesTableProps) {
  const {
    state: { targetRole, action, isLoading },
    openRevokeDialog,
    openDeleteDialog,
    closeDialog,
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
    </>
  )
}
