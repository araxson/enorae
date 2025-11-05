'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { blockedTimeSchema, type BlockedTimeFormData } from './schema'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type ActionResult<T = void> = {
  error: string | null
  data?: T
}

/**
 * Create a blocked time slot
 * RATE LIMIT: 20 creates per hour (prevents schedule spam)
 */
export async function createBlockedTime(data: BlockedTimeFormData): Promise<ActionResult> {
  // Rate limiting - 20 creates per hour per IP
  const ip = await getClientIdentifier()
  const rateLimitKey = createRateLimitKey('blocked-time-create', ip)
  const rateLimitResult = await rateLimit({
    identifier: rateLimitKey,
    limit: 20,
    windowMs: 3600000, // 1 hour
  })

  if (!rateLimitResult.success) {
    return {
      error: rateLimitResult.error || 'Too many blocked time creations. Try again later.',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create blocked times' }
  }

  // SECURITY: Use safeParse to avoid throwing errors in Server Actions
  const validation = blockedTimeSchema.safeParse(data)
  if (!validation.success) {
    return {
      error: 'Validation failed. Please check your input.',
    }
  }
  const validated = validation.data

  // Get user's salon_id from staff view
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) {
    console.error('Staff lookup error:', staffError)
    return { error: 'Staff profile not found. Please contact support.' }
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .insert({
      salon_id: staffData.salon_id,
      staff_id: user.id,
      start_time: validated.start_time,
      end_time: validated.end_time,
      block_type: validated.block_type,
      reason: validated.reason,
      is_recurring: validated.is_recurring,
      recurrence_pattern: validated.recurrence_pattern ?? null,
      created_by_id: user.id,
      updated_by_id: user.id,
    })

  if (error) {
    console.error('Blocked time creation error:', error)
    return { error: 'Failed to create blocked time. Please try again.' }
  }

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')

  return { error: null }
}

/**
 * Update a blocked time slot
 * RATE LIMIT: 50 updates per hour (allows reasonable schedule adjustments)
 */
export async function updateBlockedTime(id: string, data: BlockedTimeFormData): Promise<ActionResult> {
  // Rate limiting - 50 updates per hour per IP
  const ip = await getClientIdentifier()
  const rateLimitKey = createRateLimitKey('blocked-time-update', ip)
  const rateLimitResult = await rateLimit({
    identifier: rateLimitKey,
    limit: 50,
    windowMs: 3600000, // 1 hour
  })

  if (!rateLimitResult.success) {
    return {
      error: rateLimitResult.error || 'Too many blocked time updates. Try again later.',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update blocked times' }
  }

  // SECURITY: Use safeParse to avoid throwing errors in Server Actions
  const validation = blockedTimeSchema.safeParse(data)
  if (!validation.success) {
    return {
      error: 'Validation failed. Please check your input.',
    }
  }
  const validated = validation.data

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times_view')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== user.id) {
    return { error: 'You do not have permission to update this blocked time' }
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      start_time: validated.start_time,
      end_time: validated.end_time,
      block_type: validated.block_type,
      reason: validated.reason,
      is_recurring: validated.is_recurring,
      recurrence_pattern: validated.recurrence_pattern ?? null,
      updated_by_id: user.id,
    })
    .eq('id', id)

  if (error) {
    console.error('Blocked time update error:', error)
    return { error: 'Failed to update blocked time. Please try again.' }
  }

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')

  return { error: null }
}

/**
 * Delete a blocked time slot
 * RATE LIMIT: 20 deletes per hour (prevents abuse)
 */
export async function deleteBlockedTime(id: string): Promise<ActionResult> {
  // Rate limiting - 20 deletes per hour per IP
  const ip = await getClientIdentifier()
  const rateLimitKey = createRateLimitKey('blocked-time-delete', ip)
  const rateLimitResult = await rateLimit({
    identifier: rateLimitKey,
    limit: 20,
    windowMs: 3600000, // 1 hour
  })

  if (!rateLimitResult.success) {
    return {
      error: rateLimitResult.error || 'Too many blocked time deletions. Try again later.',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to delete blocked times' }
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times_view')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== user.id) {
    return { error: 'You do not have permission to delete this blocked time' }
  }

  // Soft delete
  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by_id: user.id,
    })
    .eq('id', id)

  if (error) {
    console.error('Blocked time deletion error:', error)
    return { error: 'Failed to delete blocked time. Please try again.' }
  }

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')

  return { error: null }
}
