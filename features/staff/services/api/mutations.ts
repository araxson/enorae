'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export async function toggleServiceAvailability(staffServiceId: string, isAvailable: boolean) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: staffService } = await supabase
    .from('staff_services' as never)
    .select('staff_id, staff!inner(user_id)')
    .eq('id', staffServiceId)
    .single()

  const ownerId = (staffService as unknown as { staff?: { user_id?: string | null } | null } | null)?.staff?.user_id

  if (!ownerId || ownerId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('organization')
    .from('staff_services' as never)
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', staffServiceId)

  if (error) throw error

  revalidatePath('/staff/services')
  return { success: true }
}

export async function updateServiceProficiency(
  staffServiceId: string,
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: staffService } = await supabase
    .from('staff_services' as never)
    .select('staff_id, staff!inner(user_id)')
    .eq('id', staffServiceId)
    .single()

  const ownerId = (staffService as unknown as { staff?: { user_id?: string | null } | null } | null)?.staff?.user_id

  if (!ownerId || ownerId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('organization')
    .from('staff_services' as never)
    .update({ proficiency_level: proficiencyLevel, updated_at: new Date().toISOString() })
    .eq('id', staffServiceId)

  if (error) throw error

  revalidatePath('/staff/services')
  return { success: true }
}

export async function requestServiceAddition(serviceId: string, notes?: string) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Get staff profile
  const { data: staffProfile } = await supabase
    .from('staff' as never)
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .single()

  if (!staffProfile) throw new Error('Staff profile not found')

  const staffId = (staffProfile as { id: string }).id

  // Check if service already exists
  const { data: existing } = await supabase
    .from('staff_services' as never)
    .select('id')
    .eq('staff_id', staffId)
    .eq('service_id', serviceId)
    .single()

  if (existing) {
    throw new Error('You are already assigned this service')
  }

  // Create service assignment request via message/notification
  // For now, create a notification to management
  const { error: notificationError } = await supabase
    .schema('communication')
    .rpc('send_notification', {
      p_user_id: session.user.id,
      p_type: 'service_request',
      p_title: 'Service Addition Request',
      p_message: `Staff member has requested to be assigned a new service. ${notes ? `Notes: ${notes}` : ''}`,
      p_data: { service_id: serviceId, staff_id: staffId, notes },
      p_channels: ['in_app'],
    })

  if (notificationError) throw notificationError

  revalidatePath('/staff/services')
  return { success: true }
}
