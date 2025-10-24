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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSalonSettings } from '@/features/business/settings/api/mutations'
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
      <div className="flex flex-col gap-8">
        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept New Bookings</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to book appointments online</p>
                </div>
                <Switch
                  checked={isAcceptingBookings}
                  onCheckedChange={setIsAcceptingBookings}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <p className="text-sm text-muted-foreground">Minimum hours before appointment</p>
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
                  <p className="text-sm text-muted-foreground">Hours before appointment can be cancelled</p>
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
                  <p className="text-sm text-muted-foreground">Maximum daily appointments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Account Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </form>
  )
}
