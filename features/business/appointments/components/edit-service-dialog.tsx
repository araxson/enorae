'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { updateAppointmentService } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import { useServiceFormOptions } from '../hooks/use-service-form-data'
import { Spinner } from '@/components/ui/spinner'
import { EditServiceFormFields } from './edit-service-dialog-form'

interface EditServiceDialogProps {
  service: AppointmentServiceDetails
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditServiceDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: EditServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    staffId: service['staff_id'] || '',
    startTime: service['start_time']
      ? new Date(service['start_time']).toTimeString().slice(0, 5)
      : '',
    endTime: service['end_time']
      ? new Date(service['end_time']).toTimeString().slice(0, 5)
      : '',
    durationMinutes: service['duration_minutes']?.toString() || '',
    status: service['status'] || 'pending',
  })
  const { toast } = useToast()
  const { options, isLoading: isLoadingStaff } = useServiceFormOptions(
    service['appointment_id'] || '',
    isOpen
  )

  useEffect(() => {
    setFormData({
      staffId: service['staff_id'] || '',
      startTime: service['start_time']
        ? new Date(service['start_time']).toTimeString().slice(0, 5)
        : '',
      endTime: service['end_time']
        ? new Date(service['end_time']).toTimeString().slice(0, 5)
        : '',
      durationMinutes: service['duration_minutes']?.toString() || '',
      status: service['status'] || 'pending',
    })
  }, [service])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('appointmentServiceId', service['id'] || '')
      if (formData.staffId) data.append('staffId', formData.staffId)

      if (formData.startTime) {
        const startDate = service['start_time'] ? new Date(service['start_time']) : new Date()
        const [hours, minutes] = formData.startTime.split(':')
        startDate.setHours(Number(hours), Number(minutes), 0, 0)
        data.append('startTime', startDate.toISOString())
      }

      if (formData.endTime) {
        const endDate = service['end_time'] ? new Date(service['end_time']) : new Date()
        const [hours, minutes] = formData.endTime.split(':')
        endDate.setHours(Number(hours), Number(minutes), 0, 0)
        data.append('endTime', endDate.toISOString())
      }

      if (formData.durationMinutes) {
        data.append('durationMinutes', formData.durationMinutes)
      }

      if (formData['status']) {
        data.append('status', formData['status'])
      }

      try {
        await updateAppointmentService(data)

        toast({
          title: 'Service updated',
          description: 'Appointment service changes were saved.',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to update service',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
        return
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to update appointment service:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to update service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <EditServiceFormFields
            serviceId={service['service_id'] || ''}
            formData={formData}
            onFormDataChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
            staff={options.staff}
            isLoadingStaff={isLoadingStaff}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Saving
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
