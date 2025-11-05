'use server'

import { revalidatePath } from 'next/cache'
import { updateSalonSchema, UUID_REGEX } from '@/features/admin/salons/api/utils'
import { ensurePlatformAdmin, getSupabaseClient } from '@/features/admin/salons/api/mutations/shared'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function updateSalon(formData: FormData): Promise<
  | { error: string; fieldErrors?: Record<string, string[] | undefined> }
  | { success: true }
> {
  const logger = createOperationLogger('updateSalon', {})
  logger.start()

  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const result = updateSalonSchema.safeParse({
      name: formData.get('name')?.toString(),
      businessName: formData.get('businessName')?.toString(),
      businessType: formData.get('businessType')?.toString(),
    })

    if (!result.success) {
      return {
        error: 'Validation failed. Please check your input.',
        fieldErrors: result.error.flatten().fieldErrors
      }
    }

    const session = await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    const updateData: Record<string, unknown> = {
      updated_by_id: session.user['id'],
    }

    if (result.data['name']) updateData['name'] = result.data['name']
    if (result.data.businessName) updateData['business_name'] = result.data.businessName
    if (result.data.businessType) updateData['business_type'] = result.data.businessType

    const { error } = await supabase
      .schema('organization')
      .from('salons')
      .update(updateData)
      .eq('id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons', 'page')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update salon',
    }
  }
}
