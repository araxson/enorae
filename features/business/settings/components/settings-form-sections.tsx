'use client'

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/lib/types/database.types'

type SalonSettings = Database['public']['Views']['salon_settings_view']['Row']

type BookingStatusSectionProps = {
  isAcceptingBookings: boolean
  onToggle: (checked: boolean) => void
}

export function BookingStatusSection({ isAcceptingBookings, onToggle }: BookingStatusSectionProps) {
  return (
    <AccordionItem value="booking-status">
      <AccordionTrigger>Booking Status</AccordionTrigger>
      <AccordionContent>
        <FieldSet className="flex flex-col gap-6 pt-4">
          <Field orientation="horizontal">
            <FieldLabel>Accept New Bookings</FieldLabel>
            <FieldContent>
              <Switch checked={isAcceptingBookings} onCheckedChange={onToggle} />
              <FieldDescription>
                Allow customers to book appointments online.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldSet>
      </AccordionContent>
    </AccordionItem>
  )
}

type BookingRulesSectionProps = {
  settings: SalonSettings | null
}

export function BookingRulesSection({ settings }: BookingRulesSectionProps) {
  return (
    <AccordionItem value="booking-rules">
      <AccordionTrigger>Booking Rules</AccordionTrigger>
      <AccordionContent>
        <FieldSet className="flex flex-col gap-6 pt-4">
          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="booking_lead_time_hours">Lead Time (hours)</FieldLabel>
              <FieldContent>
                <Input
                  id="booking_lead_time_hours"
                  name="booking_lead_time_hours"
                  type="number"
                  min="0"
                  max="720"
                  defaultValue={settings?.['booking_lead_time_hours'] ?? ''}
                  placeholder="24"
                />
              </FieldContent>
              <FieldDescription>Minimum hours before appointment.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cancellation_hours">Cancellation Window (hours)</FieldLabel>
              <FieldContent>
                <Input
                  id="cancellation_hours"
                  name="cancellation_hours"
                  type="number"
                  min="0"
                  max="168"
                  defaultValue={settings?.['cancellation_hours'] ?? ''}
                  placeholder="24"
                />
              </FieldContent>
              <FieldDescription>Hours before appointment can be cancelled.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="max_bookings_per_day">Max Bookings Per Day</FieldLabel>
              <FieldContent>
                <Input
                  id="max_bookings_per_day"
                  name="max_bookings_per_day"
                  type="number"
                  min="1"
                  max="1000"
                  defaultValue={settings?.['max_bookings_per_day'] ?? ''}
                  placeholder="50"
                />
              </FieldContent>
              <FieldDescription>Maximum daily appointments.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </AccordionContent>
    </AccordionItem>
  )
}

export function AccountLimitsSection({ settings }: BookingRulesSectionProps) {
  return (
    <AccordionItem value="account-limits">
      <AccordionTrigger>Account Limits</AccordionTrigger>
      <AccordionContent>
        <FieldSet className="flex flex-col gap-6 pt-4">
          <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="max_services">Max Services</FieldLabel>
              <FieldContent>
                <Input
                  id="max_services"
                  name="max_services"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={settings?.['max_services'] ?? ''}
                  placeholder="Unlimited"
                />
              </FieldContent>
              <FieldDescription>Total services the business can list.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="max_staff">Max Staff Members</FieldLabel>
              <FieldContent>
                <Input
                  id="max_staff"
                  name="max_staff"
                  type="number"
                  min="1"
                  max="500"
                  defaultValue={settings?.['max_staff'] ?? ''}
                  placeholder="Unlimited"
                />
              </FieldContent>
              <FieldDescription>Available staff slots across locations.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="subscription_tier">Subscription Tier</FieldLabel>
              <FieldContent>
                <Select
                  name="subscription_tier"
                  defaultValue={settings?.['subscription_tier'] ?? 'free'}
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
              </FieldContent>
              <FieldDescription>Choose the plan that controls feature access.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </AccordionContent>
    </AccordionItem>
  )
}
