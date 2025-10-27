'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BlockedTimeForm } from './blocked-time-form'
import type { BlockedTime } from '@/features/staff/blocked-times/types'

interface BlockedTimeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blockedTime?: BlockedTime
}

export function BlockedTimeDialog({ open, onOpenChange, blockedTime }: BlockedTimeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {blockedTime ? 'Edit Blocked Time' : 'Create Blocked Time'}
          </DialogTitle>
          <DialogDescription>
            {blockedTime ? 'Update the blocked time details' : 'Create a new blocked time period'}
          </DialogDescription>
        </DialogHeader>
        <BlockedTimeForm
          blockedTime={blockedTime}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
