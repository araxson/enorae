'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createBooking } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { checkStaffAvailability } from '@/features/shared/appointments/api/availability'
import type { BookingFormProps, Service, Staff } from '../types'

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
      if (service.id) {
        map.set(service.id, service.duration_minutes ?? 30)
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
        <div className="space-y-1">
          <CardTitle>Book an appointment</CardTitle>
          <small className="text-sm font-medium leading-none text-muted-foreground">{salonName}</small>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <small className="text-sm font-medium leading-none font-medium text-muted-foreground">Progress</small>
            <small className="text-sm font-medium leading-none font-medium text-muted-foreground">{progress}%</small>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <form action={handleSubmit} className="space-y-0">
        <input type="hidden" name="salonId" value={salonId} />

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="serviceId">Service</Label>
            <Select
              name="serviceId"
              value={selectedService}
              onValueChange={setSelectedService}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id || ''} value={service.id || ''}>
                    {service.name}
                    {service.category_name ? ` (${service.category_name})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffId">Staff member</Label>
            <Select
              name="staffId"
              value={selectedStaff}
              onValueChange={setSelectedStaff}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id || ''} value={member.id || ''}>
                    {member.title || 'Staff member'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={dateValue}
              onChange={(event) => setDateValue(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              required
              value={timeValue}
              onChange={(event) => setTimeValue(event.target.value)}
            />
          </div>

          {availabilityStatus !== 'idle' && (
            <div className="flex items-center gap-2 text-sm">
              {availabilityStatus === 'checking' || isCheckingAvailability ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : availabilityStatus === 'available' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : availabilityStatus === 'unavailable' ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span
                className={
                  availabilityStatus === 'available'
                    ? 'text-emerald-700'
                    : availabilityStatus === 'unavailable'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }
              >
                {availabilityMessage ??
                  (availabilityStatus === 'checking'
                    ? 'Checking staff availability...'
                    : 'Unable to determine availability.')}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              loading || !selectedService || !selectedStaff || !dateValue || !timeValue || availabilityStatus === 'unavailable'
            }
          >
            {loading ? 'Booking...' : 'Book appointment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
