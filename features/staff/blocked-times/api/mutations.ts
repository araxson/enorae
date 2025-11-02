'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { blockedTimeSchema, type BlockedTimeFormData } from './schema'

export async function createBlockedTime(data: BlockedTimeFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = blockedTimeSchema.parse(data)

  // Get user's salon_id from staff view
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

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

  if (error) throw error

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')
}

export async function updateBlockedTime(id: string, data: BlockedTimeFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = blockedTimeSchema.parse(data)

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times_view')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== user.id) {
    throw new Error('Unauthorized to update this blocked time')
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

  if (error) throw error

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')
}

export async function deleteBlockedTime(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times_view')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== user.id) {
    throw new Error('Unauthorized to delete this blocked time')
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

  if (error) throw error

  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')
}
