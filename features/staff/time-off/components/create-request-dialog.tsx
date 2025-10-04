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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Stack } from '@/components/layout'
import { toast } from 'sonner'
import { createTimeOffRequest } from '../api/mutations'

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
      // Reset form
      ;(e.target as HTMLFormElement).reset()
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
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
            <DialogDescription>
              Submit a time-off request for manager approval
            </DialogDescription>
          </DialogHeader>

          <Stack gap="lg" className="my-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <Stack gap="sm">
                <Label htmlFor="startAt">Start Date</Label>
                <Input
                  type="date"
                  id="startAt"
                  name="startAt"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </Stack>

              <Stack gap="sm">
                <Label htmlFor="endAt">End Date</Label>
                <Input
                  type="date"
                  id="endAt"
                  name="endAt"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </Stack>
            </div>

            {/* Request Type */}
            <Stack gap="sm">
              <Label htmlFor="requestType">Request Type</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick_leave">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Stack>

            {/* Reason */}
            <Stack gap="sm">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Provide additional details about your request"
                rows={3}
              />
            </Stack>

            {/* Options */}
            <Stack gap="md" className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAutoReschedule"
                  checked={isAutoReschedule}
                  onCheckedChange={(checked) => setIsAutoReschedule(checked as boolean)}
                />
                <Label
                  htmlFor="isAutoReschedule"
                  className="text-sm font-normal cursor-pointer"
                >
                  Automatically reschedule affected appointments
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNotifyCustomers"
                  checked={isNotifyCustomers}
                  onCheckedChange={(checked) => setIsNotifyCustomers(checked as boolean)}
                />
                <Label
                  htmlFor="isNotifyCustomers"
                  className="text-sm font-normal cursor-pointer"
                >
                  Notify customers about affected appointments
                </Label>
              </div>
            </Stack>
          </Stack>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
