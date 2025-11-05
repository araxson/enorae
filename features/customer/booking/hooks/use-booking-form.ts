import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { createBooking } from '@/features/customer/booking/api/mutations'
import type { BookingFormValues, Service } from '@/features/customer/booking/api/types'
import { useAvailabilityCheck } from './use-availability-check'

// Re-export for backward compatibility
export type { AvailabilityStatus } from './use-availability-check'

// NOTE: This hook is deprecated and should not use React Hook Form
// It exists only for type compatibility - migrate to Server Actions
interface FormLike {
  watch: (field: string) => unknown
  reset: () => void
}

interface UseBookingFormParams {
  services: Service[]
  form: FormLike // FIXME: Remove React Hook Form dependency
  salonId: string
}

export function useBookingForm({ services, form, salonId }: UseBookingFormParams) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const serviceId = form.watch('serviceId')
  const staffId = form.watch('staffId')
  const dateValue = form.watch('date')
  const timeValue = form.watch('time')

  const progress =
    (serviceId ? 25 : 0) + (staffId ? 25 : 0) + (dateValue && timeValue ? 25 : 0) + 25

  const serviceDurations = useMemo(() => {
    const map = new Map<string, number>()
    services.forEach((service) => {
      const serviceId = service.id
      const durationMinutes = service.duration_minutes
      if (serviceId) {
        map.set(serviceId, durationMinutes ?? 30)
      }
    })
    return map
  }, [services])

  const startDate = useMemo(() => {
    if (!dateValue || !timeValue) return null
    const dateTime = new Date(`${dateValue}T${timeValue}`)
    if (Number.isNaN(dateTime.getTime())) return null
    return dateTime
  }, [dateValue, timeValue])

  const endDate = useMemo(() => {
    if (!startDate || typeof serviceId !== 'string') return null
    const durationMinutes = serviceDurations.get(serviceId) ?? 30
    return new Date(startDate.getTime() + durationMinutes * 60_000)
  }, [startDate, serviceId, serviceDurations])

  const availability = useAvailabilityCheck(
    typeof staffId === 'string' ? staffId : '',
    startDate,
    endDate
  )

  async function submitBooking(values: BookingFormValues) {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('salonId', salonId)
      formData.append('serviceId', values.serviceId)
      formData.append('staffId', values.staffId)
      formData.append('date', values.date)
      formData.append('time', values.time)
      if (values.notes) {
        formData.append('notes', values.notes)
      }

      const result = await createBooking(null, formData)
      if (result.errors?._form) {
        const errorMsg = result.errors._form[0] ?? 'Booking failed'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      toast.success('Appointment booked successfully!')
      form.reset()
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : 'Something went wrong'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    serviceId,
    staffId,
    dateValue,
    timeValue,
    availabilityMessage: availability.availabilityMessage,
    availabilityStatus: availability.availabilityStatus,
    isCheckingAvailability: availability.isCheckingAvailability,
    progress,
    submitBooking,
  }
}
