'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/hooks/use-toast'
import { addServiceToAppointment } from '@/features/business/appointments/api/mutations'
import type { ServiceOption, StaffOption } from '@/features/business/appointments/api/queries/service-options'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

interface AddServiceDialogClientProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  services: ServiceOption[]
  staff: StaffOption[]
}

export function AddServiceDialogClient({
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
  services,
  staff,
}: AddServiceDialogClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      serviceId: '',
      staffId: '',
      startTime: '',
      endTime: '',
      durationMinutes: '',
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.serviceId) {
      toast({
        variant: 'destructive',
        title: 'Missing service',
        description: 'Please select a service before adding it to the appointment.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('appointmentId', appointmentId)
      data.append('serviceId', formData.serviceId)
      if (formData.staffId) data.append('staffId', formData.staffId)
      if (formData.startTime) data.append('startTime', formData.startTime)
      if (formData.endTime) data.append('endTime', formData.endTime)
      if (formData.durationMinutes)
        data.append('durationMinutes', formData.durationMinutes)

      await addServiceToAppointment(data)

      toast({
        title: 'Service added',
        description: 'The service was added to the appointment.',
      })

      resetForm()
      onSuccess()
    } catch (error) {
      console.error('Failed to add appointment service:', error)
      toast({
        variant: 'destructive',
        title: 'Unable to add service',
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service to Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="service">Service *</FieldLabel>
            <FieldContent>
              <Select
                value={formData.serviceId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, serviceId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled>
                      No services available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="staff">Staff (Optional)</FieldLabel>
            <FieldContent>
              <Select
                value={formData.staffId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, staffId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any available</SelectItem>
                  {staff.length > 0 ? (
                    staff.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-staff" disabled>
                      No staff available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
              <FieldContent>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, startTime: event.target.value }))
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="endTime">End Time</FieldLabel>
              <FieldContent>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, endTime: event.target.value }))
                  }
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
            <FieldContent>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.durationMinutes}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    durationMinutes: event.target.value,
                  }))
                }
                placeholder="e.g., 60"
              />
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Adding
                </>
              ) : (
                'Add Service'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
