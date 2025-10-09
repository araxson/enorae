'use client'

import { UserActionsDropdown } from './menu'
import {
  SuspendUserDialog,
  ReactivateUserDialog,
  TerminateSessionsDialog,
  DeleteUserDialog,
} from './dialogs'
import { useUserActionsMenu } from './use-user-actions-menu'
import type { UserActionsMenuProps } from './types'

export function UserActionsMenu(props: UserActionsMenuProps) {
  const {
    dialogs,
    isLoading,
    setDialog,
    handleSuspend,
    handleReactivate,
    handleTerminateSessions,
    handleDelete,
    userName,
    onDelete,
  } = useUserActionsMenu(props)

  return (
    <>
      <UserActionsDropdown
        isActive={props.isActive}
        hasDelete={Boolean(onDelete)}
        onOpenSuspend={() => setDialog('suspend', true)}
        onOpenReactivate={() => setDialog('reactivate', true)}
        onOpenTerminate={() => setDialog('terminate', true)}
        onOpenDelete={() => setDialog('delete', true)}
      />

      <SuspendUserDialog
        open={dialogs.suspend}
        onOpenChange={(open) => setDialog('suspend', open)}
        isLoading={isLoading}
        onConfirm={handleSuspend}
        userName={userName}
      />

      <ReactivateUserDialog
        open={dialogs.reactivate}
        onOpenChange={(open) => setDialog('reactivate', open)}
        isLoading={isLoading}
        onConfirm={handleReactivate}
        userName={userName}
      />

      <TerminateSessionsDialog
        open={dialogs.terminate}
        onOpenChange={(open) => setDialog('terminate', open)}
        isLoading={isLoading}
        onConfirm={handleTerminateSessions}
        userName={userName}
      />

      <DeleteUserDialog
        enabled={Boolean(onDelete)}
        open={dialogs.delete}
        onOpenChange={(open) => setDialog('delete', open)}
        isLoading={isLoading}
        onConfirm={handleDelete}
        userName={userName}
      />
    </>
  )
}
