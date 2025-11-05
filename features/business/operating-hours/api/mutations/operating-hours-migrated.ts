'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { createOperationLogger } from '@/lib/observability'

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Day of week enum type
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Constants for day name conversion
const DAY_NAMES: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function numberToDayName(dayIndex: number): DayOfWeek {
  if (dayIndex < 0 || dayIndex > 6) {
    throw new Error('Day index must be between 0 and 6')
  }
  return DAY_NAMES[dayIndex] as DayOfWeek
}

// Validation schemas
const timeFormatSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { error: 'Time must be in HH:MM format (e.g., 09:00)' })

const dayOfWeekSchema = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
  message: 'Invalid day of week',
})

const singleDaySchema = z
  .object({
    day_of_week: z.coerce.number().min(0).max(6),
    open_time: timeFormatSchema,
    close_time: timeFormatSchema,
    is_closed: z.coerce.boolean(),
  })
  .refine(
    (data) => {
      // Skip time validation if day is closed
      if (data.is_closed) return true
      // Validate close time is after open time
      return data.close_time > data.open_time
    },
    {
      message: 'Close time must be after open time',
      path: ['close_time'],
    }
  )

const bulkUpdateSchema = z.object({
  salonId: z.string().regex(UUID_REGEX, { error: 'Invalid salon ID' }),
  days: z.array(singleDaySchema).length(7, { error: 'All 7 days must be provided' }),
})

type ActionState = {
  message?: string
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
} | null

/**
 * Bulk update operating hours for all days of the week
 * SECURITY: Business users only, salon ownership verified
 * ACCESSIBILITY: Full error reporting with field-level validation
 */
export async function bulkUpdateOperatingHoursAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const logger = createOperationLogger('bulkUpdateOperatingHoursAction', {})
  logger.start()

  try {
    // Parse days data from FormData
    const salonId = formData.get('salonId') as string
    const days: Array<{
      day_of_week: number
      open_time: string
      close_time: string
      is_closed: boolean
    }> = []

    for (let i = 0; i < 7; i++) {
      const isClosed = formData.get(`day_${i}_is_closed`) === 'true'
      days.push({
        day_of_week: i,
        open_time: (formData.get(`day_${i}_open_time`) as string) || '09:00',
        close_time: (formData.get(`day_${i}_close_time`) as string) || '17:00',
        is_closed: isClosed,
      })
    }

    // Validate with Zod
    const parsed = bulkUpdateSchema.safeParse({ salonId, days })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const validated = parsed.data

    // Authentication & Authorization
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    if (!(await canAccessSalon(validated.salonId))) {
      return { error: 'Unauthorized: You do not have access to this salon' }
    }

    const supabase = await createClient()

    // Process each day
    const updates = validated.days.map(async (day) => {
      const dayName = numberToDayName(day.day_of_week)

      // Check if operating hours already exist for this day
      const { data: existing } = await supabase
        .schema('organization')
        .from('operating_hours')
        .select('id')
        .eq('salon_id', validated.salonId)
        .eq('day_of_week', dayName)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .schema('organization')
          .from('operating_hours')
          .update({
            open_time: day.open_time,
            close_time: day.close_time,
            is_closed: day.is_closed,
            updated_at: new Date().toISOString(),
            updated_by_id: session.user.id,
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .schema('organization')
          .from('operating_hours')
          .insert({
            salon_id: validated.salonId,
            day_of_week: dayName,
            open_time: day.open_time,
            close_time: day.close_time,
            is_closed: day.is_closed,
            created_by_id: session.user.id,
            updated_by_id: session.user.id,
          })

        if (error) throw error
      }
    })

    await Promise.all(updates)

    // Revalidate affected pages
    revalidatePath('/business/settings', 'page')
    revalidatePath('/business/operating-hours', 'page')

    return {
      message: 'Operating hours updated successfully',
      success: true,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error(String(error))
    logger.error(errorMessage, 'system')

    if (error instanceof z.ZodError) {
      return {
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      }
    }

    return {
      error: error instanceof Error ? error.message : 'Failed to update operating hours',
    }
  }
}
