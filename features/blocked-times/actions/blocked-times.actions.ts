'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schemas
const blockedTimeSchema = z.object({
  salon_id: z.string().regex(UUID_REGEX, 'Invalid salon ID'),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  block_type: z.string().min(1, 'Block type is required'),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  reason: z.string().min(1, 'Reason is required').optional(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: z.string().optional(),
})

/**
 * Create a new blocked time slot
 */
export async function createBlockedTime(input: z.infer<typeof blockedTimeSchema>) {
  try {
    // Validate input
    const validated = blockedTimeSchema.parse(input)

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Verify salon ownership
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', validated.salon_id)
      .limit(1)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (salonError || !typedSalon || !typedSalon.owner_id) {
      return { error: 'Salon not found' }
    }

    if (typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate time range
    if (new Date(validated.end_time) <= new Date(validated.start_time)) {
      return { error: 'End time must be after start time' }
    }

    // Create blocked time
    const { data, error } = await supabase
      .schema('scheduling')
      .from('blocked_times')
      .insert({
        salon_id: validated.salon_id,
        staff_id: validated.staff_id || null,
        block_type: validated.block_type,
        created_by_id: user.id,
        start_time: validated.start_time,
        end_time: validated.end_time,
        reason: validated.reason || null,
        is_recurring: validated.is_recurring || false,
        recurrence_pattern: validated.recurrence_pattern || null,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/blocked-times')
    revalidatePath('/staff/schedule')

    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to create blocked time' }
  }
}

/**
 * Update an existing blocked time
 */
export async function updateBlockedTime(
  id: string,
  input: Partial<z.infer<typeof blockedTimeSchema>>
) {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid blocked time ID' }
    }

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Get existing blocked time to verify ownership
    const { data: existingBlockedTime, error: fetchError } = await supabase
      .from('blocked_times')
      .select('salon_id')
      .eq('id', id)
      .limit(1)
      .single()

    const typedBlockedTime = existingBlockedTime as { salon_id: string | null } | null
    if (fetchError || !typedBlockedTime || !typedBlockedTime.salon_id) {
      return { error: 'Blocked time not found' }
    }

    // Verify salon ownership
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', typedBlockedTime.salon_id)
      .limit(1)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (salonError || !typedSalon || !typedSalon.owner_id) {
      return { error: 'Salon not found' }
    }

    if (typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate time range if both times provided
    if (input.start_time && input.end_time) {
      if (new Date(input.end_time) <= new Date(input.start_time)) {
        return { error: 'End time must be after start time' }
      }
    }

    // Update blocked time
    const { data, error } = await supabase
      .schema('scheduling')
      .from('blocked_times')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/blocked-times')
    revalidatePath('/staff/schedule')

    return { data, error: null }
  } catch (error) {
    return { error: 'Failed to update blocked time' }
  }
}

/**
 * Delete a blocked time
 */
export async function deleteBlockedTime(id: string) {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid blocked time ID' }
    }

    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Get existing blocked time to verify ownership
    const { data: existingBlockedTime, error: fetchError } = await supabase
      .from('blocked_times')
      .select('salon_id')
      .eq('id', id)
      .limit(1)
      .single()

    const typedBlockedTime = existingBlockedTime as { salon_id: string | null } | null
    if (fetchError || !typedBlockedTime || !typedBlockedTime.salon_id) {
      return { error: 'Blocked time not found' }
    }

    // Verify salon ownership
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', typedBlockedTime.salon_id)
      .limit(1)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (salonError || !typedSalon || !typedSalon.owner_id) {
      return { error: 'Salon not found' }
    }

    if (typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Delete blocked time
    const { error } = await supabase
      .schema('scheduling')
      .from('blocked_times')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/blocked-times')
    revalidatePath('/staff/schedule')

    return { success: true, error: null }
  } catch (error) {
    return { error: 'Failed to delete blocked time' }
  }
}
