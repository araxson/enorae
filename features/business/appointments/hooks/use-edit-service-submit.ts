import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { updateAppointmentService } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import type { ServiceFormData } from '../api/types'
import { logError } from '@/lib/observability'

export function useEditServiceSubmit(
  service: AppointmentServiceDetails,
  formData: ServiceFormData,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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
      logError('Failed to update appointment service', {
        operationName: 'updateAppointmentService',
        appointmentId: service['appointment_id'],
        error: error instanceof Error ? error : String(error),
        errorCategory: 'system',
      })
      toast({
        variant: 'destructive',
        title: 'Failed to update service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, handleSubmit }
}
