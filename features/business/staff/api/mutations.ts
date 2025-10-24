'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export type StaffFormData = {
  email: string
  full_name: string
  title?: string
  bio?: string
  phone?: string
  experience_years?: number
}

/**
 * Create a new staff member and invite them to the platform
 */
export async function createStaffMember(data: StaffFormData) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // First, create or get the user profile
  // Note: In production, you'd send an invitation email
  // For now, we'll create a staff profile entry

  // Check if user exists by email
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', data.email)
    .maybeSingle<{ id: string }>()

  let userId: string

  if (existingProfile?.id) {
    userId = existingProfile.id
  } else {
    // Create a placeholder profile
    // In production, this would be done via invitation flow
    const { data: newProfile, error: profileError } = await supabase
      .schema('identity')
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        username: data.email.split('@')[0],
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })
      .select('id')
      .single()

    if (profileError) throw profileError
    userId = newProfile.id
  }

  // Create staff profile
  const { error: staffError } = await supabase
    .schema('organization')
    .from('staff_profiles')
    .insert({
      salon_id: salonId,
      user_id: userId,
      title: data.title,
      bio: data.bio,
      experience_years: data.experience_years,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
    })

  if (staffError) throw staffError

  // Update profile metadata with name and phone
  await supabase
    .schema('identity')
    .from('profiles_metadata')
    .upsert({
      profile_id: userId,
      full_name: data.full_name,
      updated_at: new Date().toISOString(),
    })

  revalidatePath('/business/staff')
  return { success: true, userId }
}

/**
 * Update an existing staff member
 */
export async function updateStaffMember(staffId: string, data: Partial<StaffFormData>) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Verify staff belongs to user's salon
  const { data: staff, error: verifyError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id, user_id')
    .eq('id', staffId)
    .maybeSingle<{ salon_id: string | null; user_id: string | null }>()

  if (verifyError) throw verifyError
  if (!staff || staff.salon_id !== salonId) {
    throw new Error('Unauthorized: Staff does not belong to your salon')
  }

  // Update staff profile
  const staffUpdate: Record<string, unknown> = {}
  if (data.title !== undefined) staffUpdate.title = data.title
  if (data.bio !== undefined) staffUpdate.bio = data.bio
  if (data.experience_years !== undefined) staffUpdate.experience_years = data.experience_years

  if (Object.keys(staffUpdate).length > 0) {
    const { error } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .update(staffUpdate)
      .eq('id', staffId)

    if (error) throw error
  }

  // Update profile metadata if name provided
  if (data.full_name && staff.user_id) {
    await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: staff.user_id,
        full_name: data.full_name,
        updated_at: new Date().toISOString(),
      })
  }

  revalidatePath('/business/staff')
  return { success: true }
}

/**
 * Deactivate a staff member (soft delete)
 */
export async function deactivateStaffMember(staffId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Verify staff belongs to user's salon
  const { data: staff } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('id', staffId)
    .maybeSingle<{ salon_id: string | null }>()

  if (!staff || staff.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('organization')
    .from('staff_profiles')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', staffId)

  if (error) throw error

  revalidatePath('/business/staff')
  return { success: true }
}

/**
 * Reactivate a staff member
 */
export async function reactivateStaffMember(staffId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  // Verify staff belongs to user's salon
  const { data: staff } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('id', staffId)
    .maybeSingle<{ salon_id: string | null }>()

  if (!staff || staff.salon_id !== salonId) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('organization')
    .from('staff_profiles')
    .update({
      deleted_at: null,
    })
    .eq('id', staffId)

  if (error) throw error

  revalidatePath('/business/staff')
  return { success: true }
}
