'use server'

import { revalidatePath } from 'next/cache'
import { deleteSupplierSchema } from './utils/schemas'
import { getBusinessSession, getSupabaseClient, getSalonId } from './utils/supabase'

export async function deleteSupplier(formData: FormData) {
  try {
    const result = deleteSupplierSchema.safeParse({
      id: formData.get('id'),
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const supabase = await getSupabaseClient()
    const session = await getBusinessSession()
    const salonId = await getSalonId()

    const { data: existingSupplier } = await supabase
      .schema('inventory')
      .from('suppliers')
      .select('salon_id')
      .eq('id', result.data.id)
      .single()

    if (existingSupplier?.salon_id !== salonId) {
      return { error: 'Unauthorized: Supplier not found for your salon' }
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .update({
        is_active: false,
        updated_by_id: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', result.data.id)
      .eq('salon_id', salonId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete supplier',
    }
  }
}
