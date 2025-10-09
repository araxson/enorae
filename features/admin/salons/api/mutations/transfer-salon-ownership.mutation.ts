'use server'

import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '../utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from '../utils/supabase'

export async function transferSalonOwnership(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    const newOwnerId = formData.get('newOwnerId')?.toString()

    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }
    if (!newOwnerId || !UUID_REGEX.test(newOwnerId)) {
      return { error: 'Invalid new owner ID' }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update({
        owner_id: newOwnerId,
        updated_by_id: session.user.id,
      })
      .eq('id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons')
    return { success: true }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to transfer ownership',
    }
  }
}
