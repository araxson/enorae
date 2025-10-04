'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const salonInfoSchema = z.object({
  business_name: z.string().min(1).max(200).optional(),
  business_type: z.string().max(100).optional(),
  established_at: z.string().optional(), // Date string in YYYY-MM-DD format
})

export async function updateSalonInfo(salonId: string, formData: FormData) {
  try {
    // SECURITY: Require business user role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    // Validate salon ID
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const supabase = await createClient()

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single<{ owner_id: string | null }>()

    if (!salon || salon.owner_id !== session.user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Validate input
    const validated = salonInfoSchema.parse({
      business_name: formData.get('business_name') || undefined,
      business_type: formData.get('business_type') || undefined,
      established_at: formData.get('established_at') || undefined,
    })

    // Update salon info
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by_id: session.user.id,
    }

    if (validated.business_name) {
      updateData.business_name = validated.business_name
    }
    if (validated.business_type) {
      updateData.business_type = validated.business_type
    }
    if (validated.established_at) {
      updateData.established_at = validated.established_at
    }

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update(updateData)
      .eq('id', salonId)

    if (error) throw error

    revalidatePath('/business/settings/salon')
    revalidatePath('/business/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error updating salon info:', error)
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed: ' + error.errors[0]?.message }
    }
    return { error: 'Failed to update salon information' }
  }
}
