'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { recordUsageSchema, USAGE_PATH, INVENTORY_SCHEMA } from './schemas'

type ProductUsageInsert = Database['inventory']['Tables']['product_usage']['Insert']
type ProductCostRow = Pick<
  Database['public']['Views']['products']['Row'],
  'id' | 'salon_id' | 'cost_price'
>

export async function recordProductUsage(formData: FormData) {
  try {
    const parsed = recordUsageSchema.safeParse({
      serviceId: formData.get('serviceId') || null,
      appointmentId: formData.get('appointmentId'),
      productId: formData.get('productId'),
      locationId: formData.get('locationId'),
      quantity: formData.get('quantity') ? parseFloat(formData.get('quantity') as string) : undefined,
      notes: formData.get('notes'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    const { data: productCost, error: costError } = await supabase
      .from('products')
      .select<'id, cost_price, salon_id'>('id, cost_price, salon_id')
      .eq('id', data.productId)
      .eq('salon_id', salonId)
      .single<ProductCostRow>()

    if (costError) {
      return { error: costError.message }
    }

    if (!productCost || !productCost.id) {
      return { error: 'Product not found for this salon' }
    }

    const insertPayload: ProductUsageInsert = {
      appointment_id: data.appointmentId,
      product_id: data.productId,
      location_id: data.locationId,
      quantity_used: data.quantity,
      cost_at_time: productCost.cost_price ?? null,
      performed_by_id: session.user.id,
      notes: data.notes || null,
    }

    const { error: insertError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('product_usage')
      .insert(insertPayload)

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath(USAGE_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to record product usage',
    }
  }
}
