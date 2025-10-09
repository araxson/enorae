'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Grid } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
import { updateSalonSettings } from '../api/mutations'
import { toast } from 'sonner'
import type { Database } from '@/lib/types/database.types'

type SalonSettings = Database['public']['Views']['salon_settings']['Row']

interface SettingsFormProps {
  salonId: string
  settings: SalonSettings | null
}

export function SettingsForm({ salonId, settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(
    settings?.is_accepting_bookings ?? true
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('is_accepting_bookings', isAcceptingBookings.toString())

    const result = await updateSalonSettings(salonId, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Settings updated successfully')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {/* Booking Status */}
        <Card>
          <CardContent>
            <Stack gap="md">
              <H3>Booking Status</H3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept New Bookings</Label>
                  <Muted>Allow customers to book appointments online</Muted>
                </div>
                <Switch
                  checked={isAcceptingBookings}
                  onCheckedChange={setIsAcceptingBookings}
                />
              </div>
            </Stack>
          </CardContent>
        </Card>

        {/* Booking Rules */}
        <Card>
          <CardContent>
            <Stack gap="md">
              <H3>Booking Rules</H3>
              <Grid cols={{ base: 1, md: 2 }} gap="md">
                <div>
                  <Label htmlFor="booking_lead_time_hours">Lead Time (hours)</Label>
                  <Input
                    id="booking_lead_time_hours"
                    name="booking_lead_time_hours"
                    type="number"
                    min="0"
                    max="720"
                    defaultValue={settings?.booking_lead_time_hours ?? ''}
                    placeholder="24"
                  />
                  <Muted>Minimum hours before appointment</Muted>
                </div>

                <div>
                  <Label htmlFor="cancellation_hours">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellation_hours"
                    name="cancellation_hours"
                    type="number"
                    min="0"
                    max="168"
                    defaultValue={settings?.cancellation_hours ?? ''}
                    placeholder="24"
                  />
                  <Muted>Hours before appointment can be cancelled</Muted>
                </div>

                <div>
                  <Label htmlFor="max_bookings_per_day">Max Bookings Per Day</Label>
                  <Input
                    id="max_bookings_per_day"
                    name="max_bookings_per_day"
                    type="number"
                    min="1"
                    max="1000"
                    defaultValue={settings?.max_bookings_per_day ?? ''}
                    placeholder="50"
                  />
                  <Muted>Maximum daily appointments</Muted>
                </div>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Account Limits */}
        <Card>
          <CardContent>
            <Stack gap="md">
              <H3>Account Limits</H3>
              <Grid cols={{ base: 1, md: 3 }} gap="md">
                <div>
                  <Label htmlFor="max_services">Max Services</Label>
                  <Input
                    id="max_services"
                    name="max_services"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={settings?.max_services ?? ''}
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <Label htmlFor="max_staff">Max Staff Members</Label>
                  <Input
                    id="max_staff"
                    name="max_staff"
                    type="number"
                    min="1"
                    max="500"
                    defaultValue={settings?.max_staff ?? ''}
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <Label htmlFor="subscription_tier">Subscription Tier</Label>
                  <Select
                    name="subscription_tier"
                    defaultValue={settings?.subscription_tier ?? 'free'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
