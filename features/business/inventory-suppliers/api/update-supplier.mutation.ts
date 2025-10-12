'use server'

import { revalidatePath } from 'next/cache'
import { updateSupplierSchema } from './utils/schemas'
import { getBusinessSession, getSupabaseClient, getSalonId } from './utils/supabase'

export async function updateSupplier(formData: FormData) {
  try {
    const result = updateSupplierSchema.safeParse({
      id: formData.get('id'),
      name: formData.get('name'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      website: formData.get('website'),
      paymentTerms: formData.get('paymentTerms'),
      notes: formData.get('notes'),
      isActive: formData.get('isActive') === 'true',
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const { id, ...data } = result.data
    const supabase = await getSupabaseClient()
    const session = await getBusinessSession()
    const salonId = await getSalonId()

    const { data: existingSupplier } = await supabase
      .schema('inventory')
      .from('suppliers')
      .select('salon_id')
      .eq('id', id)
      .single()

    if (existingSupplier?.salon_id !== salonId) {
      return { error: 'Unauthorized: Supplier not found for your salon' }
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .update({
        name: data.name,
        contact_name: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        payment_terms: data.paymentTerms || null,
        notes: data.notes || null,
        is_active: data.isActive ?? true,
        updated_by_id: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('salon_id', salonId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error updating supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update supplier',
    }
  }
}
