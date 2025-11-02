'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { addServiceToAppointment } from '@/features/business/appointments/api/mutations'
import type { ServiceOption, StaffOption } from '@/features/business/appointments/api/queries'
import { Spinner } from '@/components/ui/spinner'
import { ServiceSelectField } from './service-select-field'
import { StaffSelectField } from './staff-select-field'
import { TimeFields } from './time-fields'
import { DurationField } from './duration-field'

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
      if (formData.durationMinutes) data.append('durationMinutes', formData.durationMinutes)

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
          <ServiceSelectField
            value={formData.serviceId}
            onChange={(value) => setFormData((prev) => ({ ...prev, serviceId: value }))}
            services={services}
          />

          <StaffSelectField
            value={formData.staffId}
            onChange={(value) => setFormData((prev) => ({ ...prev, staffId: value }))}
            staff={staff}
          />

          <TimeFields
            startTime={formData.startTime}
            endTime={formData.endTime}
            onStartTimeChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
            onEndTimeChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
          />

          <DurationField
            value={formData.durationMinutes}
            onChange={(value) => setFormData((prev) => ({ ...prev, durationMinutes: value }))}
          />

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
