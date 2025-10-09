'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const usageSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX),
  productId: z.string().regex(UUID_REGEX),
  quantityPerService: z.number().positive(),
  isRequired: z.boolean().optional(),
})

export async function createServiceProductUsage(formData: FormData) {
  try {
    const result = usageSchema.safeParse({
      serviceId: formData.get('serviceId'),
      productId: formData.get('productId'),
      quantityPerService: formData.get('quantityPerService') ? parseFloat(formData.get('quantityPerService') as string) : undefined,
      isRequired: formData.get('isRequired') === 'true',
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()

    const { error: insertError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .insert({
        salon_id: salonId,
        service_id: data.serviceId,
        product_id: data.productId,
        quantity_per_service: data.quantityPerService,
        is_required: data.isRequired || false,
        created_by_id: session.user.id,
        updated_by_id: session.user.id,
      })

    if (insertError) return { error: insertError.message }

    revalidatePath('/business/services/product-usage')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create usage mapping' }
  }
}

export async function updateServiceProductUsage(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const result = usageSchema.safeParse({
      serviceId: formData.get('serviceId'),
      productId: formData.get('productId'),
      quantityPerService: formData.get('quantityPerService') ? parseFloat(formData.get('quantityPerService') as string) : undefined,
      isRequired: formData.get('isRequired') === 'true',
    })

    if (!result.success) return { error: result.error.errors[0].message }

    const data = result.data
    const supabase = await createClient()
    // SECURITY: Require authentication
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const accessibleSalonIds = await getUserSalonIds()

    const { data: usageRecord, error: fetchError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .select('salon_id')
      .eq('id', id)
      .maybeSingle<{ salon_id: string | null }>()

    if (fetchError || !usageRecord?.salon_id) {
      return { error: 'Usage record not found' }
    }

    if (!accessibleSalonIds.includes(usageRecord.salon_id)) {
      return { error: 'Unauthorized: Not your salon' }
    }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .update({
        service_id: data.serviceId,
        product_id: data.productId,
        quantity_per_service: data.quantityPerService,
        is_required: data.isRequired || false,
        updated_by_id: session.user.id,
      })
      .eq('id', id)
      .eq('salon_id', usageRecord.salon_id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/business/services/product-usage')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update usage mapping' }
  }
}

export async function deleteServiceProductUsage(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) return { error: 'Invalid ID' }

    const supabase = await createClient()
    // SECURITY: Require authentication
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const accessibleSalonIds = await getUserSalonIds()

    // CRITICAL SECURITY: Verify ownership before deletion
    const { data: usage, error: verifyError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (verifyError || !usage?.salon_id) return { error: 'Usage record not found' }
    if (!accessibleSalonIds.includes(usage.salon_id)) {
      return { error: 'Unauthorized: Record does not belong to your salon' }
    }

    // Now safe to delete
    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .delete()
      .eq('id', id)
      .eq('salon_id', usage.salon_id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/services/product-usage')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete usage mapping' }
  }
}
