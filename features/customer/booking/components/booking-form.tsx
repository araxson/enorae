'use client'

import { useActionState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { createBooking } from '@/features/customer/booking/api/mutations'
import type { BookingFormProps } from '@/features/customer/booking/api/types'
import { BookingHeader } from './form/booking-header'
import {
  ServiceSelection,
  StaffSelection,
  DateTimeSelection,
  NotesField,
  BookingErrorSummary,
} from './sections'

export function BookingForm({ salonId, salonName, services, staff }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(createBooking, {})
  const firstErrorRef = useRef<HTMLSelectElement>(null)

  // Focus first error field after validation
  useEffect(() => {
    if (state?.errors && firstErrorRef.current) {
      firstErrorRef.current.focus()
    }
  }, [state?.errors])

  const serviceDurations = useMemo(() => {
    const map = new Map<string, number>()
    services.forEach((service) => {
      if (service['id']) {
        map.set(service['id'], service['duration_minutes'] ?? 30)
      }
    })
    return map
  }, [services])

  return (
    <Card>
      <BookingHeader salonName={salonName} progress={0} />

      <form action={formAction} className="space-y-0" noValidate>
        <input type="hidden" name="salonId" value={salonId} />

        <CardContent className="space-y-6">
          {/* Screen reader announcement */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
            {state?.message && !isPending && state.message}
          </div>

          <BookingErrorSummary errors={state?.errors} />

          <FieldSet>
            <FieldLegend>Appointment details</FieldLegend>
            <FieldGroup className="gap-6">
              <ServiceSelection
                services={services}
                isPending={isPending}
                errors={state?.errors?.['serviceId']}
                firstErrorRef={firstErrorRef}
              />

              <StaffSelection
                staff={staff}
                isPending={isPending}
                errors={state?.errors?.['staffId']}
              />

              <DateTimeSelection
                isPending={isPending}
                dateErrors={state?.errors?.['appointmentDate']}
                timeErrors={state?.errors?.['appointmentTime']}
              />

              <NotesField isPending={isPending} errors={state?.errors?.['notes']} />
            </FieldGroup>
          </FieldSet>
        </CardContent>

        <CardFooter>
          <div className="flex w-full justify-end">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                  <span aria-hidden="true">Booking...</span>
                  <span className="sr-only">Booking appointment, please wait</span>
                </>
              ) : (
                <span>Book appointment</span>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
