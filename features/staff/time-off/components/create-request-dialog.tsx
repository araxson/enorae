'use client'

import { useState } from 'react'
import { CalendarCheck2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { createTimeOffRequest } from '@/features/staff/time-off/api/mutations'
import { RequestFormFields } from './request-form-fields'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemMedia,
} from '@/components/ui/item'

interface CreateRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffId: string
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  staffId,
}: CreateRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestType, setRequestType] = useState<string>('vacation')
  const [isAutoReschedule, setIsAutoReschedule] = useState(false)
  const [isNotifyCustomers, setIsNotifyCustomers] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('staffId', staffId)
    formData.append('requestType', requestType)
    formData.append('isAutoReschedule', isAutoReschedule.toString())
    formData.append('isNotifyCustomers', isNotifyCustomers.toString())

    const result = await createTimeOffRequest(formData)

    if (result.success) {
      toast.success('Time-off request submitted successfully')
      onOpenChange(false)
      e.currentTarget.reset()
      setRequestType('vacation')
      setIsAutoReschedule(false)
      setIsNotifyCustomers(true)
    } else {
      toast.error(result.error || 'Failed to submit request')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <CalendarCheck2 className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <DialogTitle>Request time off</DialogTitle>
                <DialogDescription>
                  Submit a time-off request for manager approval.
                </DialogDescription>
              </ItemContent>
            </Item>
          </DialogHeader>

          <RequestFormFields
            requestType={requestType}
            isAutoReschedule={isAutoReschedule}
            isNotifyCustomers={isNotifyCustomers}
            onRequestTypeChange={setRequestType}
            onAutoRescheduleChange={setIsAutoReschedule}
            onNotifyCustomersChange={setIsNotifyCustomers}
          />

          <DialogFooter>
            <ButtonGroup aria-label="Dialog actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit request</span>
                )}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
