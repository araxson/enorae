'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { settingsContactSchema } from '@/features/business/settings-contact/api/schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface ContactDetailsInput {
  primary_phone?: string | null
  secondary_phone?: string | null
  primary_email?: string | null
  booking_email?: string | null
  website_url?: string | null
  booking_url?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  twitter_url?: string | null
  tiktok_url?: string | null
  linkedin_url?: string | null
  youtube_url?: string | null
  whatsapp_number?: string | null
  telegram_username?: string | null
  hours_display_text?: string | null
}

export async function updateSalonContactDetails(
  salonId: string,
  input: ContactDetailsInput
): Promise<ActionResponse> {
  const logger = createOperationLogger('updateSalonContactDetails', {})
  logger.start()

  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()

    if (!(await canAccessSalon(salonId))) {
      return { success: false, error: 'Unauthorized: Not your salon' }
    }

    // Validate input with Zod schema
    const validation = settingsContactSchema.safeParse(input)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { success: false, error: firstError ?? 'Validation failed' }
    }

    const validatedData = validation.data

    // Check if record exists
    const { data: existing } = await supabase
      .schema('organization')
      .from('salon_contact_details')
      .select('salon_id')
      .eq('salon_id', salonId)
      .single()

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .schema('organization')
        .from('salon_contact_details')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
          updated_by_id: session.user.id,
        })
        .eq('salon_id', salonId)

      if (error) throw error
    } else {
      // Insert new record
      const { error } = await supabase
        .schema('organization')
        .from('salon_contact_details')
        .insert({
          salon_id: salonId,
          ...validatedData,
          created_by_id: session.user.id,
          updated_by_id: session.user.id,
        })

      if (error) throw error
    }

    revalidatePath('/business/settings/contact', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update contact details',
    }
  }
}
