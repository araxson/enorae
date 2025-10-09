'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type BlockedTimeInsert = Database['scheduling']['Tables']['blocked_times']['Insert']
type BlockedTimeUpdate = Database['scheduling']['Tables']['blocked_times']['Update']

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Create a blocked time slot
 */
const createBlockedTimeSchema = z.object({
  blockType: z.enum(['break', 'meeting', 'training', 'unavailable', 'other']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  staffId: z.string().regex(UUID_REGEX).optional(),
  reason: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
})

export async function createBlockedTime(input: {
  blockType: 'break' | 'meeting' | 'training' | 'unavailable' | 'other'
  startTime: string
  endTime: string
  staffId?: string
  reason?: string
  isRecurring?: boolean
  recurrencePattern?: string
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = createBlockedTimeSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { blockType, startTime, endTime, staffId, reason, isRecurring, recurrencePattern } =
    validation.data

  // Validate time range
  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error('End time must be after start time')
  }

  // If staff is specified, verify they belong to the salon
  if (staffId) {
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('id', staffId)
      .single()

    if (staffError) throw staffError
    if (!staff) throw new Error('Staff member not found')

    const staffSalonId = (staff as { salon_id: string | null }).salon_id
    if (staffSalonId !== salonId) {
      throw new Error('Staff member does not belong to your salon')
    }
  }

  const blockedTimeData: BlockedTimeInsert = {
    salon_id: salonId,
    staff_id: staffId,
    block_type: blockType,
    start_time: startTime,
    end_time: endTime,
    reason,
    is_recurring: isRecurring || false,
    recurrence_pattern: recurrencePattern,
    created_by_id: user.id,
    is_active: true,
  }

  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .insert(blockedTimeData)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/business/schedule')
  return { success: true, blockedTime: data }
}

/**
 * Update a blocked time slot
 */
const updateBlockedTimeSchema = z.object({
  blockedTimeId: z.string().regex(UUID_REGEX),
  blockType: z.enum(['break', 'meeting', 'training', 'unavailable', 'other']).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  reason: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function updateBlockedTime(input: {
  blockedTimeId: string
  blockType?: 'break' | 'meeting' | 'training' | 'unavailable' | 'other'
  startTime?: string
  endTime?: string
  reason?: string
  isActive?: boolean
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = updateBlockedTimeSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { blockedTimeId, blockType, startTime, endTime, reason, isActive } = validation.data

  // Verify blocked time belongs to salon
  const { data: blockedTime, error: fetchError } = await supabase
    .from('blocked_times')
    .select('salon_id, start_time, end_time')
    .eq('id', blockedTimeId)
    .single()

  if (fetchError) throw fetchError
  if (!blockedTime) throw new Error('Blocked time not found')

  const blockedSalonId = (blockedTime as { salon_id: string | null }).salon_id
  if (blockedSalonId !== salonId) {
    throw new Error('Blocked time does not belong to your salon')
  }

  // Validate time range if both are provided
  const finalStartTime = startTime || (blockedTime as { start_time: string }).start_time
  const finalEndTime = endTime || (blockedTime as { end_time: string }).end_time

  if (new Date(finalEndTime) <= new Date(finalStartTime)) {
    throw new Error('End time must be after start time')
  }

  const updateData: BlockedTimeUpdate = {
    ...(blockType && { block_type: blockType }),
    ...(startTime && { start_time: startTime }),
    ...(endTime && { end_time: endTime }),
    ...(reason !== undefined && { reason }),
    ...(isActive !== undefined && { is_active: isActive }),
    updated_by_id: user.id,
  }

  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update(updateData)
    .eq('id', blockedTimeId)
    .eq('salon_id', salonId)

  if (error) throw error

  revalidatePath('/business/schedule')
  return { success: true, blockedTimeId }
}

/**
 * Delete a blocked time slot (soft delete)
 */
const deleteBlockedTimeSchema = z.object({
  blockedTimeId: z.string().regex(UUID_REGEX),
})

export async function deleteBlockedTime(blockedTimeId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = deleteBlockedTimeSchema.safeParse({ blockedTimeId })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify blocked time belongs to salon
  const { data: blockedTime, error: fetchError } = await supabase
    .from('blocked_times')
    .select('salon_id')
    .eq('id', blockedTimeId)
    .single()

  if (fetchError) throw fetchError
  if (!blockedTime) throw new Error('Blocked time not found')

  const blockedSalonId = (blockedTime as { salon_id: string | null }).salon_id
  if (blockedSalonId !== salonId) {
    throw new Error('Blocked time does not belong to your salon')
  }

  // Soft delete
  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by_id: user.id,
      is_active: false,
    })
    .eq('id', blockedTimeId)
    .eq('salon_id', salonId)

  if (error) throw error

  revalidatePath('/business/schedule')
  return { success: true, deletedId: blockedTimeId }
}

/**
 * Create recurring blocked time slots
 */
const createRecurringBlockedTimeSchema = z.object({
  blockType: z.enum(['break', 'meeting', 'training', 'unavailable', 'other']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  staffId: z.string().regex(UUID_REGEX).optional(),
  reason: z.string().optional(),
  recurrencePattern: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(), // 0 = Sunday, 6 = Saturday
  numberOfOccurrences: z.number().int().positive().max(52).default(4),
})

export async function createRecurringBlockedTime(input: {
  blockType: 'break' | 'meeting' | 'training' | 'unavailable' | 'other'
  startTime: string
  endTime: string
  staffId?: string
  reason?: string
  recurrencePattern: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  daysOfWeek?: number[]
  numberOfOccurrences?: number
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = createRecurringBlockedTimeSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const {
    blockType,
    startTime,
    endTime,
    staffId,
    reason,
    recurrencePattern,
    daysOfWeek,
    numberOfOccurrences,
  } = validation.data

  // Validate time range
  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error('End time must be after start time')
  }

  // If staff is specified, verify they belong to the salon
  if (staffId) {
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('salon_id')
      .eq('id', staffId)
      .single()

    if (staffError) throw staffError
    if (!staff) throw new Error('Staff member not found')

    const staffSalonId = (staff as { salon_id: string | null }).salon_id
    if (staffSalonId !== salonId) {
      throw new Error('Staff member does not belong to your salon')
    }
  }

  // Generate recurrence instances
  const instances: BlockedTimeInsert[] = []
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)
  const duration = endDate.getTime() - startDate.getTime()

  for (let i = 0; i < numberOfOccurrences; i++) {
    let nextStart = new Date(startDate)

    switch (recurrencePattern) {
      case 'daily':
        nextStart.setDate(startDate.getDate() + i)
        break
      case 'weekly':
        nextStart.setDate(startDate.getDate() + i * 7)
        break
      case 'biweekly':
        nextStart.setDate(startDate.getDate() + i * 14)
        break
      case 'monthly':
        nextStart.setMonth(startDate.getMonth() + i)
        break
    }

    // If daysOfWeek is specified, skip days not in the array
    if (daysOfWeek && daysOfWeek.length > 0) {
      if (!daysOfWeek.includes(nextStart.getDay())) {
        continue
      }
    }

    const nextEnd = new Date(nextStart.getTime() + duration)

    instances.push({
      salon_id: salonId,
      staff_id: staffId,
      block_type: blockType,
      start_time: nextStart.toISOString(),
      end_time: nextEnd.toISOString(),
      reason,
      is_recurring: true,
      recurrence_pattern: `${recurrencePattern}${daysOfWeek ? `:${daysOfWeek.join(',')}` : ''}`,
      created_by_id: user.id,
      is_active: true,
    })
  }

  // Insert all instances
  const { error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .insert(instances)

  if (error) throw error

  revalidatePath('/business/schedule')
  return {
    success: true,
    created: instances.length,
    recurrencePattern,
  }
}
