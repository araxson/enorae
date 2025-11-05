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

type ReactivateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  onConfirm: () => void
  userName: string
}

export function ReactivateUserDialog({
  open,
  onOpenChange,
  isLoading,
  onConfirm,
  userName,
}: ReactivateUserDialogProps) {
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
            {isLoading ? (
              <>
                <Spinner />
                Reactivating…
              </>
            ) : (
              'Reactivate User'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
