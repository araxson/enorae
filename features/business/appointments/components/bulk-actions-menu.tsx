'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { ChevronDown, CheckCircle, XCircle, Clock, Ban } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import {
  bulkCancelAppointments,
  bulkConfirmAppointments,
  bulkCompleteAppointments,
  bulkNoShowAppointments,
} from '@/features/business/appointments/api/mutations'

interface BulkActionsMenuProps {
  selectedIds: string[]
  onClearSelection: () => void
}

export function BulkActionsMenu({ selectedIds, onClearSelection }: BulkActionsMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<'cancel' | 'confirm' | 'complete' | 'no_show' | null>(null)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAction = async (actionType: typeof action) => {
    if (actionType === 'cancel') {
      setAction('cancel')
      setIsDialogOpen(true)
    } else {
      setAction(actionType)
      await executeAction(actionType)
    }
  }

  const executeAction = async (actionType: typeof action) => {
    if (!actionType || selectedIds.length === 0) return

    setIsLoading(true)
    try {
      switch (actionType) {
        case 'cancel':
          await bulkCancelAppointments(selectedIds, reason)
          toast({
            title: 'Appointments cancelled',
            description: `${selectedIds.length} appointments have been cancelled.`,
          })
          break
        case 'confirm':
          await bulkConfirmAppointments(selectedIds)
          toast({
            title: 'Appointments confirmed',
            description: `${selectedIds.length} appointments have been confirmed.`,
          })
          break
        case 'complete':
          await bulkCompleteAppointments(selectedIds)
          toast({
            title: 'Appointments completed',
            description: `${selectedIds.length} appointments have been marked as completed.`,
          })
          break
        case 'no_show':
          await bulkNoShowAppointments(selectedIds)
          toast({
            title: 'Appointments marked as no-show',
            description: `${selectedIds.length} appointments have been marked as no-show.`,
          })
          break
      }
      onClearSelection()
      setIsDialogOpen(false)
      setReason('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointments. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Bulk Actions ({selectedIds.length})
            <ChevronDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleAction('confirm')}>
            <CheckCircle className="mr-2 size-4" />
            Confirm Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('complete')}>
            <Clock className="mr-2 size-4" />
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAction('cancel')}>
            <XCircle className="mr-2 size-4" />
            Cancel Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('no_show')}>
            <Ban className="mr-2 size-4" />
            Mark as No-Show
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointments</DialogTitle>
            <DialogDescription>
              You are about to cancel {selectedIds.length} appointment(s). Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Field>
              <FieldLabel htmlFor="reason">Reason for cancellation</FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  placeholder="Enter reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </FieldContent>
              <FieldDescription>
                We&apos;ll share this with customers so they understand the update.
              </FieldDescription>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => executeAction('cancel')}
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Cancelling</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
