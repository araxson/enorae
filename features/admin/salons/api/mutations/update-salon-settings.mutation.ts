import 'server-only'

import { revalidatePath } from 'next/cache'
import { updateSettingsSchema, UUID_REGEX } from '@/features/admin/salons/api/utils/schemas'
import { ensurePlatformAdmin, getSupabaseClient } from '@/features/admin/salons/api/mutations/shared'

export async function updateSalonSettings(formData: FormData) {
  try {
    const salonId = formData.get('salonId')?.toString()
    if (!salonId || !UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID' }
    }

    const result = updateSettingsSchema.safeParse({
      subscriptionTier: formData.get('subscriptionTier')?.toString(),
      isAcceptingBookings: formData.get('isAcceptingBookings') === 'true',
      maxStaff: formData.get('maxStaff') ? parseInt(formData.get('maxStaff') as string) : undefined,
      maxServices: formData.get('maxServices')
        ? parseInt(formData.get('maxServices') as string)
        : undefined,
    })

    if (!result.success) {
      return { error: result.error.issues[0]?.message ?? 'Validation failed' }
    }

    await ensurePlatformAdmin()
    const supabase = await getSupabaseClient()

    const updateData: Record<string, unknown> = {}

    if (result.data.subscriptionTier)
      updateData['subscription_tier'] = result.data.subscriptionTier
    if (result.data.isAcceptingBookings !== undefined)
      updateData['is_accepting_bookings'] = result.data.isAcceptingBookings
    if (result.data.maxStaff) updateData['max_staff'] = result.data.maxStaff
    if (result.data.maxServices) updateData['max_services'] = result.data.maxServices

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update(updateData)
      .eq('salon_id', salonId)

    if (error) return { error: error.message }

    revalidatePath('/admin/salons', 'page')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update settings',
    }
  }
}
