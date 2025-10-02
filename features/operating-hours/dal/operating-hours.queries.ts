import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type OperatingHour = Database['public']['Views']['operating_hours']['Row']
type DayOfWeek = Database['public']['Enums']['day_of_week']

// Helper to convert number to day name
const DAY_NAMES: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function numberToDayName(day: number): DayOfWeek {
  if (day < 0 || day > 6) {
    throw new Error('Day must be between 0 and 6')
  }
  return DAY_NAMES[day]
}

/**
 * Get operating hours for a specific salon
 */
export async function getOperatingHoursBySalon(salonId: string) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', salonId)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get operating hours for a specific day
 */
export async function getOperatingHoursByDay(salonId: string, dayOfWeek: DayOfWeek | number) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dayName = typeof dayOfWeek === 'number' ? numberToDayName(dayOfWeek) : dayOfWeek

  const { data, error } = await supabase
    .from('operating_hours')
    .select('*')
    .eq('salon_id', salonId)
    .eq('day_of_week', dayName)
    .single()

  if (error) throw error
  return data
}

/**
 * Get salon for current user (for operating hours)
 */
export async function getOperatingHoursSalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (error || !salon) {
    throw new Error('No salon found for your account')
  }

  return salon as { id: string }
}
