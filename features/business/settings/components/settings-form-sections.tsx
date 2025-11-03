'use client'

import { UseFormReturn } from 'react-hook-form'
import { SalonSettingsSchema, SalonSettingsSchemaInput } from '@/features/business/settings/api/schema'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BookingStatusSectionProps = {
  form: UseFormReturn<SalonSettingsSchemaInput, unknown, SalonSettingsSchema>
}

export function BookingStatusSection({ form }: BookingStatusSectionProps) {
  return (
    <AccordionItem value="booking-status">
      <AccordionTrigger>Booking Status</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-6 pt-4">
          <FormField
            control={form.control}
            name="is_accepting_bookings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Accept new bookings</FormLabel>
                  <FormDescription>
                    Allow customers to book appointments online.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

type BookingRulesSectionProps = {
  form: UseFormReturn<SalonSettingsSchemaInput, unknown, SalonSettingsSchema>
}

export function BookingRulesSection({ form }: BookingRulesSectionProps) {
  return (
    <AccordionItem value="booking-rules">
      <AccordionTrigger>Booking Rules</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-6 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="booking_lead_time_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Time (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="720"
                      placeholder="24"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Minimum hours before appointment.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cancellation_window_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Window (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="168"
                      placeholder="24"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Hours before appointment can be cancelled.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_bookings_per_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Bookings Per Day</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      placeholder="50"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Maximum daily appointments.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function AccountLimitsSection({ form }: BookingRulesSectionProps) {
  return (
    <AccordionItem value="account-limits">
      <AccordionTrigger>Account Limits</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-6 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="max_services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Services</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Unlimited"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Total services the business can list.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_staff_members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Staff Members</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="500"
                      placeholder="Unlimited"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      value={(field.value as string | number | undefined) ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Available staff slots across locations.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
