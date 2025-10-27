'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createBooking } from '@/features/customer/booking/api/mutations'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Calendar, Clock } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { checkStaffAvailability } from '@/features/shared/appointments/api/availability'
import { AvailabilityIndicator } from './form/availability-indicator'
import type { BookingFormProps, Service, Staff } from '@/features/customer/booking/types'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'

export function BookingForm({ salonId, salonName, services, staff }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle')
  const [isCheckingAvailability, startAvailabilityCheck] = useTransition()

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

  const latestCheckRef = useRef(0)

  useEffect(() => {
    if (!selectedStaff || !startDate || !endDate) {
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
          staffId: selectedStaff,
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
          // Show specific reason if available
          if (result['reason']) {
            const blockTypeLabel = result.blockType ? `(${result.blockType})` : ''
            setAvailabilityMessage(`Time blocked ${blockTypeLabel}: ${result['reason']}`)
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
  }, [selectedStaff, startDate, endDate])

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
      <CardHeader className="space-y-4">
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Calendar className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Book an appointment</CardTitle>
              <CardDescription>{salonName}</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <div className="space-y-2">
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Progress</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <ItemDescription>{progress}% complete</ItemDescription>
              </ItemActions>
            </Item>
          </ItemGroup>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <form action={handleSubmit} className="space-y-0">
        <input type="hidden" name="salonId" value={salonId} />

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Booking failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FieldSet>
            <FieldLegend>Appointment details</FieldLegend>
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="serviceId">Service</FieldLabel>
                <FieldContent>
                  <Select
                    name="serviceId"
                    value={selectedService}
                    onValueChange={setSelectedService}
                    required
                  >
                    <SelectTrigger id="serviceId">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service['id'] || ''} value={service['id'] || ''}>
                          {service['name']}
                          {service['category_name'] ? ` (${service['category_name']})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="staffId">Staff member</FieldLabel>
                <FieldContent>
                  <Select
                    name="staffId"
                    value={selectedStaff}
                    onValueChange={setSelectedStaff}
                    required
                  >
                    <SelectTrigger id="staffId">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member['id'] || ''} value={member['id'] || ''}>
                          {member['title'] || 'Staff member'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="date"
                      name="date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={dateValue}
                      onChange={(event) => setDateValue(event.target.value)}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="time">Time</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Clock className="h-4 w-4" aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="time"
                      name="time"
                      type="time"
                      required
                      value={timeValue}
                      onChange={(event) => setTimeValue(event.target.value)}
                    />
                  </InputGroup>
                </FieldContent>
              </Field>
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
