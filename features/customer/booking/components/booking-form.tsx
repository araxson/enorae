'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { createBooking } from '@/features/customer/booking/api/mutations'
import type { BookingFormProps } from '@/features/customer/booking/types'
import { useAvailabilityCheck } from '../hooks/use-availability-check'
import { BookingHeader } from './form/booking-header'
import { ServiceStaffFields } from './form/service-staff-fields'
import { DateTimeFields } from './form/date-time-fields'
import { AvailabilityIndicator } from './form/availability-indicator'

export function BookingForm({ salonId, salonName, services, staff }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  const progress = (selectedService ? 25 : 0) + (selectedStaff ? 25 : 0) + (dateValue && timeValue ? 25 : 0) + 25

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
    if (!startDate || !selectedService) return null
    const durationMinutes = serviceDurations.get(selectedService) ?? 30
    const end = new Date(startDate.getTime() + durationMinutes * 60_000)
    return end
  }, [startDate, selectedService, serviceDurations])

  const { availabilityStatus, availabilityMessage, isCheckingAvailability } = useAvailabilityCheck(
    selectedStaff,
    startDate,
    endDate
  )

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await createBooking(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        return
      }

      toast.success('Appointment booked successfully!')
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : 'Something went wrong'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <BookingHeader salonName={salonName} progress={progress} />

      <form action={handleSubmit} className="space-y-0">
        <input type="hidden" name="salonId" value={salonId} aria-hidden="true" />

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Booking failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FieldSet>
            <FieldLegend>Appointment details</FieldLegend>
            <FieldGroup className="gap-6">
              <ServiceStaffFields
                services={services}
                staff={staff}
                selectedService={selectedService}
                selectedStaff={selectedStaff}
                onServiceChange={setSelectedService}
                onStaffChange={setSelectedStaff}
              />
              <DateTimeFields
                dateValue={dateValue}
                timeValue={timeValue}
                onDateChange={setDateValue}
                onTimeChange={setTimeValue}
              />
            </FieldGroup>
          </FieldSet>

          <AvailabilityIndicator
            status={availabilityStatus}
            message={availabilityMessage}
            isCheckingAvailability={isCheckingAvailability}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !selectedService ||
              !selectedStaff ||
              !dateValue ||
              !timeValue ||
              availabilityStatus === 'unavailable'
            }
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                <span>Booking</span>
              </>
            ) : (
              <span>Book appointment</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
