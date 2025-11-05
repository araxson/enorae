import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { addServiceToAppointment } from '@/features/business/appointments/api/mutations'
import type { ServiceFormData } from '../api/types'
import { logError } from '@/lib/observability'

export function useAddServiceSubmit(
  appointmentId: string,
  formData: ServiceFormData,
  resetForm: () => void,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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

      try {
        await addServiceToAppointment(data)

        toast({
          title: 'Service added',
          description: 'The service was added to the appointment.',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to add service',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
        return
      }

      resetForm()
      onSuccess()
    } catch (error) {
      logError('Failed to add appointment service', {
        operationName: 'addServiceToAppointment',
        appointmentId,
        error: error instanceof Error ? error : String(error),
        errorCategory: 'system',
      })
      toast({
        variant: 'destructive',
        title: 'Failed to add service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, handleSubmit }
}
