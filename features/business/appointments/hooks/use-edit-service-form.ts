import { useEffect, useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { updateAppointmentService } from '@/features/business/appointments/api/mutations'
import { ServiceOptionsResponseSchema, type AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import type { StaffOption, ServiceFormData } from '../api/types'
import { TIME_MS } from '@/lib/config/constants'
import { logError, logDebug } from '@/lib/observability'

export function useEditServiceForm(
  service: AppointmentServiceDetails,
  isOpen: boolean,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staff, setStaff] = useState<StaffOption[]>([])

  // Use service.id as key to reset form when service changes
  const serviceKey = service['id'] || ''

  const [formData, setFormData] = useState<ServiceFormData>(() => ({
    staffId: service['staff_id'] || '',
    startTime: service['start_time']
      ? new Date(service['start_time']).toTimeString().slice(0, 5)
      : '',
    endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
    durationMinutes: service['duration_minutes']?.toString() || '',
    status: service['status'] || 'pending',
  }))
  const { toast } = useToast()

  // Reset form when service changes (by comparing service ID)
  useEffect(() => {
    setFormData({
      staffId: service['staff_id'] || '',
      startTime: service['start_time'] ? new Date(service['start_time']).toTimeString().slice(0, 5) : '',
      endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
      durationMinutes: service['duration_minutes']?.toString() || '',
      status: service['status'] || 'pending',
    })
  }, [serviceKey, service])

  // Load staff options
  useEffect(() => {
    if (!isOpen || !service['appointment_id']) {
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadStaff = async () => {
      setIsLoadingStaff(true)
      try {
        // API_INTEGRATION_FIX: Add 10 second timeout for API calls
        const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
        const response = await fetch(
          `/api/business/appointments/${service['appointment_id']}/service-options`,
          {
            signal: AbortSignal.any([controller.signal, timeoutSignal]),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to load staff options (${response['status']})`)
        }

        const rawData = await response.json()

        // API_INTEGRATION_FIX: Validate response schema
        const validationResult = ServiceOptionsResponseSchema.safeParse(rawData)
        if (!validationResult.success) {
          logError('Invalid API response in EditService', {
            operationName: 'loadStaffOptions',
            appointmentId: service['appointment_id'],
            error: validationResult.error,
            errorCategory: 'validation',
          })
          throw new Error('Invalid API response format')
        }

        if (!isMounted) return

        const data = validationResult.data
        setStaff(data.staff ?? [])
      } catch (error) {
        // API_INTEGRATION_FIX: Handle AbortError and timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
          logDebug('Staff load request cancelled or timed out', {
            operationName: 'loadStaffOptions',
            appointmentId: service['appointment_id'],
          })
          return
        }
        logError('Failed to load staff options', {
          operationName: 'loadStaffOptions',
          appointmentId: service['appointment_id'],
          error: error instanceof Error ? error : String(error),
          errorCategory: 'network',
        })
        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load staff',
            description:
              error instanceof Error ? error.message : 'Please try again shortly.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingStaff(false)
        }
      }
    }

    void loadStaff()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [isOpen, service['appointment_id'], toast])

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

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoadingStaff,
    staff,
    handleSubmit,
  }
}
