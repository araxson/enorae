import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { checkStaffAvailability } from '@/features/shared/appointments/api/queries/availability'
import { createBooking } from '@/features/customer/booking/api/mutations'
import type { BookingFormValues, Service } from '@/features/customer/booking/types'

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

interface UseBookingFormParams {
  services: Service[]
  form: UseFormReturn<BookingFormValues>
  salonId: string
}

export function useBookingForm({ services, form, salonId }: UseBookingFormParams) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle')
  const [isCheckingAvailability, startAvailabilityCheck] = useTransition()

  const serviceId = form.watch('serviceId')
  const staffId = form.watch('staffId')
  const dateValue = form.watch('date')
  const timeValue = form.watch('time')

  const progress =
    (serviceId ? 25 : 0) + (staffId ? 25 : 0) + (dateValue && timeValue ? 25 : 0) + 25

  const serviceDurations = useMemo(() => {
    const map = new Map<string, number>()
    services.forEach((service) => {
      if (service['id']) {
        map.set(service['id'], service['duration_minutes'] ?? 30)
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
    if (!startDate || !serviceId) return null
    const durationMinutes = serviceDurations.get(serviceId) ?? 30
    return new Date(startDate.getTime() + durationMinutes * 60_000)
  }, [startDate, serviceId, serviceDurations])

  const latestCheckRef = useRef(0)

  useEffect(() => {
    if (!staffId || !startDate || !endDate) {
      setAvailabilityStatus('idle')
      setAvailabilityMessage(null)
      return
    }

    setAvailabilityStatus('checking')
    setAvailabilityMessage(null)

    const checkId = latestCheckRef.current + 1
    latestCheckRef.current = checkId

    startAvailabilityCheck(async () => {
      try {
        const result = await checkStaffAvailability({
          staffId,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        })

        if (checkId !== latestCheckRef.current) {
          return
        }

        if (result.available) {
          setAvailabilityStatus('available')
          setAvailabilityMessage('Staff member is available for the selected time.')
        } else {
          setAvailabilityStatus('unavailable')
          if (result.reason) {
            const blockTypeLabel = result.blockType ? `(${result.blockType})` : ''
            setAvailabilityMessage(`Time blocked ${blockTypeLabel}: ${result.reason}`)
          } else {
            setAvailabilityMessage('Staff member has a conflict at the selected time.')
          }
        }
      } catch (availabilityError) {
        if (checkId !== latestCheckRef.current) {
          return
        }
        setAvailabilityStatus('error')
        setAvailabilityMessage(
          availabilityError instanceof Error
            ? availabilityError.message
            : 'Unable to check availability. Please try again.',
        )
      }
    })
  }, [staffId, startDate, endDate])

  async function submitBooking(values: BookingFormValues) {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('salonId', salonId)
      formData.append('serviceId', values.serviceId)
      formData.append('staffId', values.staffId)
      formData.append('date', values['date'])
      formData.append('time', values.time)
      if (values.notes) {
        formData.append('notes', values.notes)
      }

      const result = await createBooking(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
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
    availabilityMessage,
    availabilityStatus,
    isCheckingAvailability,
    progress,
    submitBooking,
  }
}
