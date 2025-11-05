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
import { Spinner } from '@/components/ui/spinner'

type SuspendUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  onConfirm: () => void
  userName: string
}

export function SuspendUserDialog({
  open,
  onOpenChange,
  isLoading,
  onConfirm,
  userName,
}: SuspendUserDialogProps) {
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
            {isLoading ? (
              <>
                <Spinner />
                Suspending…
              </>
            ) : (
              'Suspend User'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
