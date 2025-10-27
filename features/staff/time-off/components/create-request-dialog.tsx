'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { createTimeOffRequest } from '@/features/staff/time-off/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

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
            <DialogTitle>Request time off</DialogTitle>
            <DialogDescription>
              Submit a time-off request for manager approval.
            </DialogDescription>
          </DialogHeader>

          <FieldSet className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="startAt">Start date</FieldLabel>
                <FieldContent>
                  <Input
                    type="date"
                    id="startAt"
                    name="startAt"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="endAt">End date</FieldLabel>
                <FieldContent>
                  <Input
                    type="date"
                    id="endAt"
                    name="endAt"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="requestType">Request type</FieldLabel>
              <FieldContent>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="requestType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick_leave">Sick leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Provide additional details about your request"
                  rows={3}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldDescription>Notifications</FieldDescription>
              <FieldContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isAutoReschedule"
                      checked={isAutoReschedule}
                      onCheckedChange={(checked) => setIsAutoReschedule(!!checked)}
                    />
                    <span>Automatically reschedule affected appointments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isNotifyCustomers"
                      checked={isNotifyCustomers}
                      onCheckedChange={(checked) => setIsNotifyCustomers(!!checked)}
                    />
                    <span>Notify customers about affected appointments</span>
                  </div>
                </div>
              </FieldContent>
            </Field>
          </FieldSet>

          <DialogFooter>
            <ButtonGroup className="justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit request'}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
