'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Day of week enum type
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Constants for day name conversion
const DAYS_IN_WEEK = 7
const MIN_DAY_INDEX = 0
const MAX_DAY_INDEX = 6

// Helper to convert number to day name
const DAY_NAMES: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function numberToDayName(dayIndex: number): DayOfWeek {
  if (dayIndex < MIN_DAY_INDEX || dayIndex > MAX_DAY_INDEX) {
    throw new Error(`Day index must be between ${MIN_DAY_INDEX} and ${MAX_DAY_INDEX}`)
  }
  return DAY_NAMES[dayIndex] as DayOfWeek
}

// Validation schemas
const operatingHourSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  open_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  close_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  is_closed: z.boolean(),
})

/**
 * Create or update operating hours for a salon
 */
export async function upsertOperatingHours(input: z.infer<typeof operatingHourSchema>) {
  const logger = createOperationLogger('upsertOperatingHours', {})
  logger.start()

  try {
    // Validate input
    const validation = operatingHourSchema.safeParse(input)

    if (!validation.success) {
      return {
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const validated = validation.data

    const supabase = await createClient()

    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    if (!(await canAccessSalon(validated.salon_id))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Check if operating hours already exist for this day
        const { data: existing } = await supabase
      .schema('organization')
      .from('operating_hours')
      .select('id')
      .eq('salon_id', validated.salon_id)
      .eq('day_of_week', validated.day_of_week)
      .single()

    if (existing) {
      // Update existing
            const { data, error } = await supabase
        .schema('organization')
        .from('operating_hours')
        .update({
          open_time: validated.open_time,
          close_time: validated.close_time,
          is_closed: validated.is_closed,
          updated_at: new Date().toISOString(),
          updated_by_id: session.user.id,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      revalidatePath('/business/settings', 'page')
      revalidatePath('/business/operating-hours', 'page')

      return { data, error: null }
    } else {
      // Create new
            const { data, error } = await supabase
        .schema('organization')
        .from('operating_hours')
        .insert({
          salon_id: validated.salon_id,
          day_of_week: validated.day_of_week,
          open_time: validated.open_time,
          close_time: validated.close_time,
          is_closed: validated.is_closed,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      revalidatePath('/business/settings', 'page')
      revalidatePath('/business/operating-hours', 'page')

      return { data, error: null }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? 'Validation failed' }
    }
    return { error: 'Failed to save operating hours' }
  }
}

/**
 * Bulk update operating hours for all days
 */
export async function bulkUpdateOperatingHours(
  salonId: string,
  hours: Array<{
    day_of_week: DayOfWeek | number
    open_time: string
    close_time: string
    is_closed: boolean
  }>
) {
  try {
    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    if (!(await canAccessSalon(salonId))) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Update each day
    const promises = hours.map((hour) =>
      upsertOperatingHours({
        salon_id: salonId,
        day_of_week: typeof hour.day_of_week === 'number'
          ? numberToDayName(hour.day_of_week)
          : hour.day_of_week,
        open_time: hour.open_time,
        close_time: hour.close_time,
        is_closed: hour.is_closed,
      })
    )

    const results = await Promise.all(promises)

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      return { error: errors[0]?.error ?? 'Update failed' }
    }

    return { success: true, error: null }
  } catch {
    return { error: 'Failed to update operating hours' }
  }
}

/**
 * Special Hours Feature Documentation
 *
 * The operating_hours table supports special hours (e.g., holidays, events) using
 * effective_from and effective_until timestamp fields. This allows salons to override
 * regular operating hours for specific date ranges.
 *
 * Implementation requires:
 * - UI components for creating special hours entries
 * - Date range picker with effective_from and effective_until fields
 * - Logic to prioritize special hours over regular hours in booking queries
 * - Validation to prevent overlapping special hour ranges
 *
 * Query pattern for special hours:
 * SELECT * FROM organization.operating_hours
 * WHERE salon_id = ? AND effective_from <= ? AND effective_until >= ?
 */
