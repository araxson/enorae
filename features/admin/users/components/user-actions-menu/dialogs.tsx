'use client'

import { SuspendUserDialog } from './suspend-user-dialog'
import { ReactivateUserDialog } from './reactivate-user-dialog'
import { TerminateSessionsDialog } from './terminate-sessions-dialog'
import { DeleteUserDialog } from './delete-user-dialog'

// Re-export individual dialogs
export { SuspendUserDialog } from './suspend-user-dialog'
export { ReactivateUserDialog } from './reactivate-user-dialog'
export { TerminateSessionsDialog } from './terminate-sessions-dialog'
export { DeleteUserDialog } from './delete-user-dialog'

// Compound dialog wrapper component
export function UserActionDialogs({
  userName,
  dialogs,
  isLoading,
  onSuspend,
  onReactivate,
  onTerminate,
  onDelete,
  deleteReason,
  onDeleteReasonChange,
  hasDelete,
}: {
  userName: string
  dialogs: { suspend: boolean; reactivate: boolean; terminate: boolean; delete: boolean }
  isLoading: boolean
  onSuspend: () => void
  onReactivate: () => void
  onTerminate: () => void
  onDelete: () => void
  deleteReason: string
  onDeleteReasonChange: (reason: string) => void
  hasDelete: boolean
}) {
  return (
    <>
      <SuspendUserDialog
        open={dialogs.suspend}
        onOpenChange={() => {}}
        isLoading={isLoading}
        onConfirm={onSuspend}
        userName={userName}
      />
      <ReactivateUserDialog
        open={dialogs.reactivate}
        onOpenChange={() => {}}
        isLoading={isLoading}
        onConfirm={onReactivate}
        userName={userName}
      />
      <TerminateSessionsDialog
        open={dialogs.terminate}
        onOpenChange={() => {}}
        isLoading={isLoading}
        onConfirm={onTerminate}
        userName={userName}
      />
      <DeleteUserDialog
        open={dialogs.delete}
        onOpenChange={() => {}}
        isLoading={isLoading}
        onConfirm={onDelete}
        userName={userName}
        enabled={hasDelete}
        reason={deleteReason}
        onReasonChange={onDeleteReasonChange}
      />
    </>
  )
}
