import { revalidatePath } from 'next/cache'
import { UUID_REGEX } from '../utils/schemas'
import { getSupabaseClient, requireBusinessSession, requireSalonId } from '../utils/supabase'

export async function deletePurchaseOrderMutation(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await getSupabaseClient()
    const session = await requireBusinessSession()
    const salonId = await requireSalonId()

    const { data: order } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .select('status')
      .eq('id', id)
      .eq('salon_id', salonId)
      .single()

    if (order?.status !== 'pending') {
      return { error: 'Only pending orders can be deleted' }
    }

    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/inventory/purchase-orders')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete order' }
  }
}
