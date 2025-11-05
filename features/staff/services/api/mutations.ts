'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function toggleServiceAvailability(staffServiceId: string, isAvailable: boolean): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle<{ id: string | null }>()

    if (!staffProfile?.id) {
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    const { data: staffService } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('staff_id')
      .eq('id', staffServiceId)
      .maybeSingle<{ staff_id: string | null }>()

    if (!staffService?.staff_id || staffService.staff_id !== staffProfile.id) {
      return { success: false, error: 'You do not have permission to modify this service' }
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

    if (error) {
      console.error('Service availability toggle error:', error)
      return { success: false, error: 'Failed to update service availability. Please try again.' }
    }

    revalidatePath('/staff/services', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error toggling service availability:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function updateServiceProficiency(
  staffServiceId: string,
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Verify ownership
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle<{ id: string | null }>()

    if (!staffProfile?.id) {
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    const { data: staffService } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('staff_id')
      .eq('id', staffServiceId)
      .maybeSingle<{ staff_id: string | null }>()

    if (!staffService?.staff_id || staffService.staff_id !== staffProfile.id) {
      return { success: false, error: 'You do not have permission to modify this service' }
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

    if (error) {
      console.error('Service proficiency update error:', error)
      return { success: false, error: 'Failed to update service proficiency. Please try again.' }
    }

    revalidatePath('/staff/services', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating service proficiency:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function requestServiceAddition(serviceId: string, notes?: string): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Get staff profile
    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .maybeSingle<{ id: string | null; salon_id: string | null }>()

    if (!staffProfile?.id) {
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    if (!staffProfile.salon_id) {
      return { success: false, error: 'Salon not found. Please contact support.' }
    }

    const staffId = staffProfile.id

    // Check if service already exists
    const { data: existing } = await supabase
      .schema('catalog')
      .from('staff_services')
      .select('id')
      .eq('staff_id', staffId)
      .eq('service_id', serviceId)
      .maybeSingle<{ id: string | null }>()

    if (existing?.id) {
      return { success: false, error: 'You are already assigned to this service' }
    }

    // TODO: Implement notification creation when RPC function types are available
    console.log('[Services] Would notify management of service request:', {
      serviceId,
      staffId,
      notes,
    })

    revalidatePath('/staff/services', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error requesting service addition:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
