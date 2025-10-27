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
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

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
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2">
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
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2">
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
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Spinner />
                Terminating…
              </>
            ) : (
              'Terminate Sessions'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type DeleteDialogProps = DialogProps & {
  enabled: boolean
  reason: string
  onReasonChange: (value: string) => void
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  isLoading,
  onConfirm,
  userName,
  enabled,
  reason,
  onReasonChange,
}: DeleteDialogProps) {
  if (!enabled) return null

  const isReasonValid = reason.trim().length >= 10

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
        <Field data-invalid={!isReasonValid}>
          <FieldLabel htmlFor="delete-user-reason">Reason (minimum 10 characters)</FieldLabel>
          <FieldContent>
            <Textarea
              id="delete-user-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Provide the rationale for this permanent deletion"
              autoFocus
            />
            {!isReasonValid ? (
              <FieldDescription className="text-destructive">
                Please provide a reason of at least 10 characters.
              </FieldDescription>
            ) : null}
          </FieldContent>
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              disabled={isLoading || !isReasonValid}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Deleting…
                </>
              ) : (
                'Delete Permanently'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
