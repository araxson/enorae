'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const WarningText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-destructive font-semibold">{children}</span>
)

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  onConfirm: () => void
  userName: string
}

export function SuspendUserDialog({ open, onOpenChange, isLoading, onConfirm, userName }: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to suspend <strong>{userName}</strong>? This will deactivate all roles
            and sessions. The user can be reactivated later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Suspending...' : 'Suspend User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ReactivateUserDialog({ open, onOpenChange, isLoading, onConfirm, userName }: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reactivate <strong>{userName}</strong>? You will need to manually
            reactivate their roles.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Reactivating...' : 'Reactivate User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function TerminateSessionsDialog({
  open,
  onOpenChange,
  isLoading,
  onConfirm,
  userName,
}: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terminate All Sessions</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to terminate all active sessions for <strong>{userName}</strong>? They will
            be logged out of all devices.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Terminating...' : 'Terminate Sessions'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type DeleteDialogProps = DialogProps & { enabled: boolean }

export function DeleteUserDialog({ open, onOpenChange, isLoading, onConfirm, userName, enabled }: DeleteDialogProps) {
  if (!enabled) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            <WarningText>WARNING: This action is irreversible!</WarningText>
            <br />
            <br />
            Are you absolutely sure you want to permanently delete <strong>{userName}</strong>? All user data will
            be lost. This should only be done for GDPR compliance or legal requests.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
