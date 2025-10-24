import { useEffect, useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { addServiceToAppointment } from '@/features/business/appointments/api/mutations'
import type { ServiceOption, StaffOption, ServiceFormData } from './types'

export function useAddServiceForm(
  appointmentId: string,
  isOpen: boolean,
  onSuccess: () => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [services, setServices] = useState<ServiceOption[]>([])
  const [staff, setStaff] = useState<StaffOption[]>([])
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true

    const loadOptions = async () => {
      setIsLoadingOptions(true)
      try {
        const response = await fetch(
          `/api/business/appointments/${appointmentId}/service-options`
        )

        if (!response.ok) {
          throw new Error(`Failed to load options (${response.status})`)
        }

        const data: { services?: ServiceOption[]; staff?: StaffOption[] } =
          await response.json()

        if (!isMounted) return

        setServices(data.services ?? [])
        setStaff(data.staff ?? [])
      } catch (error) {
        console.error('Failed to load appointment service options:', error)
        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load service options',
            description:
              error instanceof Error
                ? error.message
                : 'Please try again in a moment.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => {
      isMounted = false
    }
  }, [appointmentId, isOpen, toast])

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

      const result = await addServiceToAppointment(data)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to add service',
          description: result.error,
        })
        return
      }

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
        title: 'Failed to add service',
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
    isLoadingOptions,
    services,
    staff,
    handleSubmit,
  }
}
