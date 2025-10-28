'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
          <Button size="sm" variant="destructive" onClick={onCancel} disabled={isPending}>
            Cancel Request
          </Button>
        )}
      </ButtonGroup>
    )
  }

  // Manager view: can approve/reject
  if (status === 'pending') {
    return (
      <ButtonGroup aria-label="Request actions">
        <Button size="sm" variant="outline" onClick={onReject} disabled={isPending}>
          Reject
        </Button>
        <Button size="sm" onClick={onApprove} disabled={isPending}>
          Approve
        </Button>
      </ButtonGroup>
    )
  }

  return null
}
