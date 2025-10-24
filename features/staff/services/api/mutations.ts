'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export async function toggleServiceAvailability(staffServiceId: string, isAvailable: boolean) {
  const session = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: staffProfile } = await supabase
    .from('staff_profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .maybeSingle<{ id: string | null }>()

  if (!staffProfile?.id) {
    throw new Error('Staff profile not found')
  }

  const { data: staffService } = await supabase
    .from('staff_services_with_metrics')
    .select('staff_id')
    .eq('id', staffServiceId)
    .maybeSingle<{ staff_id: string | null }>()

  if (!staffService?.staff_id || staffService.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  const updatePayload: Database['catalog']['Tables']['staff_services']['Update'] = {
    is_available: isAvailable,
    updated_at: new Date().toISOString(),
    updated_by_id: session.user.id,
  }

  const { error } = await supabase
    .schema('catalog')
    .from('staff_services')
    .update(updatePayload)
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
  const { data: staffProfile } = await supabase
    .from('staff_profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .maybeSingle<{ id: string | null }>()

  if (!staffProfile?.id) {
    throw new Error('Staff profile not found')
  }

  const { data: staffService } = await supabase
    .from('staff_services_with_metrics')
    .select('staff_id')
    .eq('id', staffServiceId)
    .maybeSingle<{ staff_id: string | null }>()

  if (!staffService?.staff_id || staffService.staff_id !== staffProfile.id) {
    throw new Error('Unauthorized')
  }

  const proficiencyUpdate: Database['catalog']['Tables']['staff_services']['Update'] = {
    proficiency_level: proficiencyLevel,
    updated_at: new Date().toISOString(),
    updated_by_id: session.user.id,
  }

  const { error } = await supabase
    .schema('catalog')
    .from('staff_services')
    .update(proficiencyUpdate)
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
    .from('staff_profiles')
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .maybeSingle<{ id: string | null; salon_id: string | null }>()

  if (!staffProfile?.id) throw new Error('Staff profile not found')
  if (!staffProfile.salon_id) throw new Error('User salon not found')

  const staffId = staffProfile.id

  // Check if service already exists
  const { data: existing } = await supabase
    .from('staff_services_with_metrics')
    .select('id')
    .eq('staff_id', staffId)
    .eq('service_id', serviceId)
    .maybeSingle<{ id: string | null }>()

  if (existing?.id) {
    throw new Error('You are already assigned this service')
  }

  // TODO: Implement notification creation when RPC function types are available
  console.log('[Services] Would notify management of service request:', {
    serviceId,
    staffId,
    notes,
  })

  revalidatePath('/staff/services')
  return { success: true }
}
