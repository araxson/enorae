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
import type { UserRole } from '@/lib/types/app.types'

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  onConfirm: () => void
  role?: UserRole | null
}

export function RevokeRoleDialog({ open, onOpenChange, isLoading, onConfirm, role }: DialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke the <strong>{role?.role?.replace(/_/g, ' ') || 'Unknown'}</strong> role
            from <strong>{role?.user_id || 'Unknown user'}</strong>? This will deactivate the role but preserve the record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Revoking...' : 'Revoke'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type DeleteDialogProps = DialogProps & { enabled: boolean }

export function DeleteRoleDialog({ open, onOpenChange, isLoading, onConfirm, enabled }: DeleteDialogProps) {
  if (!enabled) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role Assignment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this role assignment? This action cannot be undone.
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
