import { useEffect, useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { updateAppointmentService } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import type { StaffOption, ServiceFormData } from './types'

export function useEditServiceForm(
  service: AppointmentServiceDetails,
  isOpen: boolean,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staff, setStaff] = useState<StaffOption[]>([])
  const [formData, setFormData] = useState<ServiceFormData>({
    staffId: service['staff_id'] || '',
    startTime: service['start_time']
      ? new Date(service['start_time']).toTimeString().slice(0, 5)
      : '',
    endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
    durationMinutes: service['duration_minutes']?.toString() || '',
    status: service['status'] || 'pending',
  })
  const { toast } = useToast()

  // Sync form data with service prop
  useEffect(() => {
    setFormData({
      staffId: service['staff_id'] || '',
      startTime: service['start_time'] ? new Date(service['start_time']).toTimeString().slice(0, 5) : '',
      endTime: service['end_time'] ? new Date(service['end_time']).toTimeString().slice(0, 5) : '',
      durationMinutes: service['duration_minutes']?.toString() || '',
      status: service['status'] || 'pending',
    })
  }, [service])

  // Load staff options
  useEffect(() => {
    if (!isOpen || !service['appointment_id']) {
      return
    }

    let isMounted = true

    const loadStaff = async () => {
      setIsLoadingStaff(true)
      try {
        const response = await fetch(
          `/api/business/appointments/${service['appointment_id']}/service-options`
        )

        if (!response.ok) {
          throw new Error(`Failed to load staff options (${response['status']})`)
        }

        const data: { staff?: StaffOption[] } = await response.json()
        if (!isMounted) return

        setStaff(data.staff ?? [])
      } catch (error) {
        console.error('Failed to load staff options:', error)
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

      const result = await updateAppointmentService(data)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to update service',
          description: result.error,
        })
        return
      }

      toast({
        title: 'Service updated',
        description: 'Appointment service changes were saved.',
      })

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

  return {
    formData,
    setFormData,
    isSubmitting,
    isLoadingStaff,
    staff,
    handleSubmit,
  }
}
