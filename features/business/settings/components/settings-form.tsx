'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Accordion } from '@/components/ui/accordion'
import { updateSalonSettings } from '@/features/business/settings/api/mutations'
import { toast } from 'sonner'
import type { Database } from '@/lib/types/database.types'
import {
  BookingStatusSection,
  BookingRulesSection,
  AccountLimitsSection,
} from './settings-form-sections'

type SalonSettings = Database['public']['Views']['salon_settings_view']['Row']

interface SettingsFormProps {
  salonId: string
  settings: SalonSettings | null
}

export function SettingsForm({ salonId, settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(
    settings?.['is_accepting_bookings'] ?? true
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
        <Accordion type="multiple" defaultValue={['booking-status', 'booking-rules', 'account-limits']} className="w-full">
          <BookingStatusSection
            isAcceptingBookings={isAcceptingBookings}
            onToggle={setIsAcceptingBookings}
          />
          <BookingRulesSection settings={settings} />
          <AccountLimitsSection settings={settings} />
        </Accordion>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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
  )
}
