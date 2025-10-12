import 'server-only'

import { z } from 'zod'
import { getSalonContext, revalidateSettings } from './helpers'

const bookingRulesSchema = z.object({
  booking_lead_time_hours: z.number().int().min(0).max(720).optional(),
  max_bookings_per_day: z.number().int().min(1).max(1000).optional(),
  max_services: z.number().int().min(1).max(100).optional(),
  allow_same_day_booking: z.boolean().optional(),
  require_deposit: z.boolean().optional(),
  deposit_percentage: z.number().min(0).max(100).optional(),
})

function extractBoolean(formData: FormData, key: string) {
  return formData.get(key) === 'true'
}

function extractNumber(formData: FormData, key: string) {
  const value = formData.get(key)
  if (value === null || value === undefined || value === '') {
    return undefined
  }
  return Number(value)
}

export async function updateBookingRules(
  salonId: string,
  formData: FormData,
) {
  try {
    const supabase = await getSalonContext(salonId)

    const validated = bookingRulesSchema.parse({
      booking_lead_time_hours: extractNumber(formData, 'booking_lead_time_hours'),
      max_bookings_per_day: extractNumber(formData, 'max_bookings_per_day'),
      max_services: extractNumber(formData, 'max_services'),
      allow_same_day_booking: extractBoolean(formData, 'allow_same_day_booking'),
      require_deposit: extractBoolean(formData, 'require_deposit'),
      deposit_percentage: extractNumber(formData, 'deposit_percentage'),
    })

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidateSettings()
    return { success: true }
  } catch (error) {
    console.error('Error updating booking rules:', error)
    if (error instanceof z.ZodError) {
      return { error: `Validation failed: ${error.errors[0]?.message}` }
    }
    return { error: 'Failed to update booking rules' }
  }
}
