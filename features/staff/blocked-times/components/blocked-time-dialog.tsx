'use client'
import { Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BlockedTimeForm } from './blocked-time-form'
import type { BlockedTime } from '@/features/staff/blocked-times/types'
import {
  Item,
  ItemContent,
  ItemMedia,
} from '@/components/ui/item'

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
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Clock className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <DialogTitle>
                {blockedTime ? 'Edit Blocked Time' : 'Create Blocked Time'}
              </DialogTitle>
              <DialogDescription>
                {blockedTime ? 'Update the blocked time details' : 'Create a new blocked time period'}
              </DialogDescription>
            </ItemContent>
          </Item>
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
