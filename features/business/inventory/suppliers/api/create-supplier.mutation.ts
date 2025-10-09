'use server'

import { revalidatePath } from 'next/cache'
import { createSupplierSchema } from './utils/schemas'
import { getBusinessSession, getSupabaseClient, getSalonId } from './utils/supabase'

export async function createSupplier(formData: FormData) {
  try {
    const result = createSupplierSchema.safeParse({
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

    const supabase = await getSupabaseClient()
    const session = await getBusinessSession()
    const salonId = await getSalonId()

    const { error: insertError } = await supabase
      .schema('inventory')
      .from('suppliers')
      .insert({
        name: result.data.name,
        contact_name: result.data.contactName || null,
        email: result.data.email || null,
        phone: result.data.phone || null,
        address: result.data.address || null,
        website: result.data.website || null,
        payment_terms: result.data.paymentTerms || null,
        notes: result.data.notes || null,
        is_active: result.data.isActive ?? true,
        salon_id: salonId,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath('/business/inventory/suppliers')
    revalidatePath('/business/inventory')

    return { success: true }
  } catch (error) {
    console.error('Error creating supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create supplier',
    }
  }
}
