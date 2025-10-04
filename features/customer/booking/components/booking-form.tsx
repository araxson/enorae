'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createBooking } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

import { Stack, Group } from '@/components/layout'
import { AlertCircle } from 'lucide-react'
import { Small } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']

interface BookingFormProps {
  salonId: string
  services: Service[]
  staff: Staff[]
}

export function BookingForm({ salonId, services, staff }: BookingFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStaff, setSelectedStaff] = useState<string>('')

  // Calculate progress based on filled fields
  const progress =
    (selectedService ? 25 : 0) +
    (selectedStaff ? 25 : 0) +
    25 // Date and time fields contribute remaining 50%

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createBooking(formData)
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Appointment booked successfully!')
    }
  }

  return (
    <Card>
      <CardHeader>
        <Stack gap="sm">
          <CardTitle>Book an Appointment</CardTitle>
          <Stack gap="xs">
            <Group gap="sm" className="justify-between">
              <Small className="text-muted-foreground">Progress</Small>
              <Small className="text-muted-foreground">{progress}%</Small>
            </Group>
            <Progress value={progress} className="h-2" />
          </Stack>
        </Stack>
      </CardHeader>

      <form action={handleSubmit}>
        <input type="hidden" name="salonId" value={salonId} />

        <CardContent>
          <Stack gap="md">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Stack gap="xs">
              <Label htmlFor="serviceId">Service</Label>
              <Select name="serviceId" value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id || ''} value={service.id || ''}>
                      {service.name} {service.category_name ? `(${service.category_name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="staffId">Staff Member</Label>
              <Select name="staffId" value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((member) => (
                    <SelectItem key={member.id || ''} value={member.id || ''}>
                      {member.title || 'Staff Member'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </Stack>

            <Stack gap="xs">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                required
              />
            </Stack>
          </Stack>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading || !selectedService || !selectedStaff}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
