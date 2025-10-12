'use server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { productUsageSchema, type ProductUsageFormData } from '../schema'

export async function recordProductUsage(data: ProductUsageFormData) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validated = productUsageSchema.parse(data)

  const supabase = await createClient()

  // Get product cost at time of use
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('cost_price')
    .eq('id', validated.product_id)
    .single<{ cost_price: number | null }>()

  if (productError || !productData) throw new Error('Product not found')

  const { error } = await supabase
    .schema('inventory')
    .from('product_usage')
    .insert({
      appointment_id: validated.appointment_id,
      product_id: validated.product_id,
      location_id: validated.location_id,
      quantity_used: validated.quantity_used,
      cost_at_time: productData.cost_price,
      performed_by_id: session.user.id,
      notes: validated.notes,
    })

  if (error) throw error

  revalidatePath('/staff/product-usage')
  revalidatePath('/staff/appointments')
}

export async function deleteProductUsage(id: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from('product_usage')
    .select('performed_by_id')
    .eq('id', id)
    .single<{ performed_by_id: string | null }>()

  if (!existing || existing.performed_by_id !== session.user.id) {
    throw new Error('Unauthorized to delete this product usage')
  }

  const { error } = await supabase
    .schema('inventory')
    .from('product_usage')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/staff/product-usage')
  revalidatePath('/staff/appointments')
}
