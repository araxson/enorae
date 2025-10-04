'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface DescriptionInput {
  short_description?: string | null
  full_description?: string | null
  welcome_message?: string | null
  cancellation_policy?: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[] | null
  amenities?: string[] | null
  specialties?: string[] | null
  payment_methods?: string[] | null
  languages_spoken?: string[] | null
  awards?: string[] | null
  certifications?: string[] | null
}

export async function updateSalonDescription(
  salonId: string,
  input: DescriptionInput
): Promise<ActionResponse> {
  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single<{ owner_id: string | null }>()

    if (!salon || salon.owner_id !== session.user.id) {
      return { success: false, error: 'Unauthorized: Not your salon' }
    }

    // Check if description exists
    const { data: existing } = await supabase
      .schema('organization')
      .from('salon_descriptions')
      .select('salon_id')
      .eq('salon_id', salonId)
      .single()

    if (existing) {
      // Update existing description
      const { error } = await supabase
        .schema('organization')
        .from('salon_descriptions')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
          updated_by_id: session.user.id,
        })
        .eq('salon_id', salonId)

      if (error) throw error
    } else {
      // Insert new description
      const { error } = await supabase
        .schema('organization')
        .from('salon_descriptions')
        .insert({
          salon_id: salonId,
          ...input,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })

      if (error) throw error
    }

    revalidatePath('/business/settings/description')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating salon description:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update description',
    }
  }
}
