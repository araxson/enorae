'use server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { blockedTimeSchema, type BlockedTimeFormData } from '../schema'

export async function createBlockedTime(data: BlockedTimeFormData) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validated = blockedTimeSchema.parse(data)

  const supabase = await createClient()

  // Get user's salon_id from staff view
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', session.user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .insert({
      salon_id: staffData.salon_id,
      staff_id: session.user.id,
      start_time: validated.start_time,
      end_time: validated.end_time,
      block_type: validated.block_type as 'break' | 'personal' | 'meeting' | 'other',
      reason: validated.reason,
      is_recurring: validated.is_recurring,
      recurrence_pattern: validated.recurrence_pattern ?? null,
      created_by_id: session.user.id,
      is_active: true,
    })

  if (error) throw error

  revalidatePath('/staff/blocked-times')
  revalidatePath('/staff/schedule')
}

export async function updateBlockedTime(id: string, data: BlockedTimeFormData) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validated = blockedTimeSchema.parse(data)

  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== session.user.id) {
    throw new Error('Unauthorized to update this blocked time')
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      start_time: validated.start_time,
      end_time: validated.end_time,
      block_type: validated.block_type as 'break' | 'personal' | 'meeting' | 'other',
      reason: validated.reason,
      is_recurring: validated.is_recurring,
      recurrence_pattern: validated.recurrence_pattern ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/staff/blocked-times')
  revalidatePath('/staff/schedule')
}

export async function deleteBlockedTime(id: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== session.user.id) {
    throw new Error('Unauthorized to delete this blocked time')
  }

  // Soft delete
  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by_id: session.user.id,
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/staff/blocked-times')
  revalidatePath('/staff/schedule')
}
