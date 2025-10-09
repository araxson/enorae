'use server'

import { revalidatePath } from 'next/cache'
import { statusSchema, UUID_REGEX } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession, requireSalonId } from '../utils/supabase'

export async function updatePurchaseOrderStatus(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    const status = formData.get('status')?.toString()

    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }
    if (!status || !statusSchema.safeParse(status).success) {
      return { error: 'Invalid status' }
    }

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()
    const salonId = await requireSalonId()

    const updateData: Record<string, unknown> = {
      status,
      updated_by_id: session.user.id,
    }

    if (status === 'received') {
      updateData.actual_delivery_date = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .update(updateData)
      .eq('id', id)
      .eq('salon_id', salonId)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update status' }
  }
}
