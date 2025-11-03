'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Accordion } from '@/components/ui/accordion'
import { updateSalonSettings } from '@/features/business/settings/api/mutations'
import { salonSettingsSchema, type SalonSettingsSchema, type SalonSettingsSchemaInput } from '@/features/business/settings/api/schema'
import { toast } from 'sonner'
import type { Database } from '@/lib/types/database.types'
import {
  BookingStatusSection,
  BookingRulesSection,
  AccountLimitsSection,
} from './settings-form-sections'
import { Form } from '@/components/ui/form'

type SalonSettings = Database['public']['Views']['salon_settings_view']['Row']

interface SettingsFormProps {
  salonId: string
  settings: SalonSettings | null
}

export function SettingsForm({ salonId, settings }: SettingsFormProps) {
  const form = useForm<SalonSettingsSchemaInput, unknown, SalonSettingsSchema>({
    resolver: zodResolver(salonSettingsSchema),
    defaultValues: {
      is_accepting_bookings: settings?.is_accepting_bookings ?? true,
      booking_lead_time_hours: settings?.booking_lead_time_hours ?? undefined,
      max_bookings_per_day: settings?.max_bookings_per_day ?? undefined,
      max_services: settings?.max_services ?? undefined,
      max_staff_members: settings?.max_staff ?? undefined,
      max_locations: undefined,
      allow_same_day_booking: true,
      require_deposit: false,
      deposit_percentage: undefined,
      cancellation_window_hours: settings?.cancellation_hours ?? undefined,
      refund_percentage: undefined,
      no_show_fee: undefined,
      late_cancellation_fee: undefined,
      booking_pause_reason: undefined,
      booking_pause_until: undefined,
    },
    mode: 'onSubmit',
  })

  async function handleSubmit(data: SalonSettingsSchema) {
    const formData = new FormData()
    formData.set('is_accepting_bookings', String(data.is_accepting_bookings))

    if (data.booking_lead_time_hours !== undefined && data.booking_lead_time_hours !== null) {
      formData.set('booking_lead_time_hours', String(data.booking_lead_time_hours))
    }
    if (data.cancellation_window_hours !== undefined && data.cancellation_window_hours !== null) {
      formData.set('cancellation_hours', String(data.cancellation_window_hours))
    }
    if (data.max_bookings_per_day !== undefined && data.max_bookings_per_day !== null) {
      formData.set('max_bookings_per_day', String(data.max_bookings_per_day))
    }
    if (data.max_services !== undefined && data.max_services !== null) {
      formData.set('max_services', String(data.max_services))
    }
    if (data.max_staff_members !== undefined && data.max_staff_members !== null) {
      formData.set('max_staff', String(data.max_staff_members))
    }

    const result = await updateSalonSettings(salonId, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Settings updated successfully')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-8">
          <Accordion type="multiple" defaultValue={['booking-status', 'booking-rules', 'account-limits']} className="w-full">
            <BookingStatusSection form={form} />
            <BookingRulesSection form={form} />
            <AccountLimitsSection form={form} />
          </Accordion>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Spinner />
                  Saving
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
