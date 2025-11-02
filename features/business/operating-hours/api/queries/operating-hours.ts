import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type OperatingHour = Database['public']['Views']['operating_hours_view']['Row']
type DayOfWeek = Database['public']['Enums']['day_of_week']

// Helper to convert number to day name
const DAY_NAMES: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function numberToDayName(day: number): DayOfWeek {
  if (day < 0 || day > 6) {
    throw new Error('Day must be between 0 and 6')
  }
  return DAY_NAMES[day] as DayOfWeek
}

/**
 * Get operating hours for a specific salon
 */
export async function getOperatingHoursBySalon(salonId: string): Promise<OperatingHour[]> {
  const logger = createOperationLogger('getOperatingHoursBySalon', {})
  logger.start()

  // SECURITY: Require business role and verify access
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('day_of_week', { ascending: true })

  if (error) throw error

  // Filter out any rows with null IDs and validate structure
  const validRows = (data || []).filter((row): row is OperatingHour => {
    return row !== null && row !== undefined && 'id' in row && row.id !== null
  })

  return validRows
}

/**
 * Get operating hours for a specific day
 */
export async function getOperatingHoursByDay(salonId: string, dayOfWeek: DayOfWeek | number): Promise<OperatingHour | null> {
  // SECURITY: Require business role and verify access
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const dayName = typeof dayOfWeek === 'number' ? numberToDayName(dayOfWeek) : dayOfWeek

  const { data, error } = await supabase
    .from('operating_hours_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('day_of_week', dayName)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Get salon for current user (for operating hours)
 */
export async function getOperatingHoursSalon() {
  // SECURITY: Require authentication and reuse central helper
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}