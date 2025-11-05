'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RequestEditDialog } from './request-edit-dialog'

interface RequestActionsProps {
  status: string
  isStaffView: boolean
  isPending: boolean
  editDialogOpen: boolean
  onEditDialogChange: (open: boolean) => void
  startAt: string
  endAt: string
  requestType: string
  reason: string
  onUpdate: (data: { startAt: string; endAt: string; requestType: string; reason: string }) => void
  onCancel: () => void
  onApprove: () => void
  onReject: () => void
}

export function RequestActions({
  status,
  isStaffView,
  isPending,
  editDialogOpen,
  onEditDialogChange,
  startAt,
  endAt,
  requestType,
  reason,
  onUpdate,
  onCancel,
  onApprove,
  onReject,
}: RequestActionsProps) {
  const formattedRequestType = requestType
    ? requestType.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Time off'

  if (isStaffView) {
    // Staff view: can edit pending requests or cancel any request
    return (
      <ButtonGroup aria-label="Request actions">
        {status === 'pending' && (
          <RequestEditDialog
            open={editDialogOpen}
            onOpenChange={onEditDialogChange}
            startAt={startAt}
            endAt={endAt}
            requestType={requestType}
            reason={reason}
            isPending={isPending}
            onSave={onUpdate}
          />
        )}
        {(status === 'pending' || status === 'approved') && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isPending}>
                Cancel Request
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your {formattedRequestType.toLowerCase()} request from {startAt || 'the selected start date'} to {endAt || 'the selected end date'}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Keep request</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={onCancel}
                >
                  {isPending ? 'Cancelling…' : 'Confirm cancellation'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </ButtonGroup>
    )
  }

  // Manager view: can approve/reject
  if (status === 'pending') {
    return (
      <ButtonGroup aria-label="Request actions">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isPending}>
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this request?</AlertDialogTitle>
              <AlertDialogDescription>
                The employee will be notified that their {formattedRequestType.toLowerCase()} was rejected. You can add notes before submitting the final decision.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Go back</AlertDialogCancel>
              <AlertDialogAction disabled={isPending} onClick={onReject}>
                {isPending ? 'Submitting…' : 'Reject request'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button size="sm" onClick={onApprove} disabled={isPending}>
          Approve
        </Button>
      </ButtonGroup>
    )
  }

  return null
}
