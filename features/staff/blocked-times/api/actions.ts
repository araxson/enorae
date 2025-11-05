'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { blockedTimeSchema } from './schema'

type ActionState = {
  success: boolean
  message: string
  errors: Record<string, string[]>
}

export async function createBlockedTimeAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to create blocked times',
      errors: {},
    }
  }

  // Parse form data
  const parsed = blockedTimeSchema.safeParse({
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time'),
    block_type: formData.get('block_type'),
    reason: formData.get('reason'),
    is_recurring: formData.get('is_recurring') === 'on',
    recurrence_pattern: formData.get('recurrence_pattern') || null,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Get user's salon_id from staff view
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) {
    console.error('Staff lookup error:', staffError)
    return {
      success: false,
      message: 'Staff profile not found. Please contact support.',
      errors: {},
    }
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .insert({
      salon_id: staffData.salon_id,
      staff_id: user.id,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      block_type: parsed.data.block_type,
      reason: parsed.data.reason,
      is_recurring: parsed.data.is_recurring,
      recurrence_pattern: parsed.data.recurrence_pattern ?? null,
      created_by_id: user.id,
      updated_by_id: user.id,
    })

  if (error) {
    console.error('Blocked time creation error:', error)
    return {
      success: false,
      message: 'Failed to create blocked time. Please try again.',
      errors: {},
    }
  }

  // Next.js 15+: revalidatePath requires type parameter
  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')

  return {
    success: true,
    message: 'Blocked time created successfully',
    errors: {},
  }
}

export async function updateBlockedTimeAction(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to update blocked times',
      errors: {},
    }
  }

  // Parse form data
  const parsed = blockedTimeSchema.safeParse({
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time'),
    block_type: formData.get('block_type'),
    reason: formData.get('reason'),
    is_recurring: formData.get('is_recurring') === 'on',
    recurrence_pattern: formData.get('recurrence_pattern') || null,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('blocked_times_view')
    .select('staff_id')
    .eq('id', id)
    .single<{ staff_id: string | null }>()

  if (!existing || existing.staff_id !== user.id) {
    return {
      success: false,
      message: 'You do not have permission to update this blocked time',
      errors: {},
    }
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      block_type: parsed.data.block_type,
      reason: parsed.data.reason,
      is_recurring: parsed.data.is_recurring,
      recurrence_pattern: parsed.data.recurrence_pattern ?? null,
      updated_by_id: user.id,
    })
    .eq('id', id)

  if (error) {
    console.error('Blocked time update error:', error)
    return {
      success: false,
      message: 'Failed to update blocked time. Please try again.',
      errors: {},
    }
  }

  // Next.js 15+: revalidatePath requires type parameter
  revalidatePath('/staff/blocked-times', 'page')
  revalidatePath('/staff/schedule', 'page')

  return {
    success: true,
    message: 'Blocked time updated successfully',
    errors: {},
  }
}
