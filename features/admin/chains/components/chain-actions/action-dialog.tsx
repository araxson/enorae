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
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { getActionText } from './utils'
import type { ChainActionType } from './types'

interface ActionDialogProps {
  open: boolean
  action: ChainActionType
  chainName: string
  reason: string
  reasonError: string | null
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onReasonChange: (reason: string) => void
  onConfirm: () => void
}

/**
 * Confirmation dialog for chain actions
 */
export function ActionDialog({
  open,
  action,
  chainName,
  reason,
  reasonError,
  isLoading,
  onOpenChange,
  onReasonChange,
  onConfirm,
}: ActionDialogProps) {
  const actionText = getActionText(action)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionText.title}</AlertDialogTitle>
          <AlertDialogDescription>{actionText.description}</AlertDialogDescription>
          <AlertDialogDescription>Chain: {chainName}</AlertDialogDescription>
        </AlertDialogHeader>
        <Field data-invalid={Boolean(reasonError)}>
          <FieldLabel htmlFor="chain-reason">Reason (required)</FieldLabel>
          <FieldContent>
            <Textarea
              id="chain-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Provide context for this action (minimum 10 characters)"
              aria-invalid={Boolean(reasonError)}
              autoFocus
              rows={4}
            />
            <FieldDescription>
              Provide at least 10 characters to explain the action.
            </FieldDescription>
          </FieldContent>
          {reasonError ? <FieldError>{reasonError}</FieldError> : null}
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-4" />
                <span>Processing…</span>
              </>
            ) : (
              <span>Confirm</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
