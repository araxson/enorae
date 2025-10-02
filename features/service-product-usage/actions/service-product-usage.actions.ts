'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: service_product_usage doesn't have public view yet
// Keeping .schema() calls until public views are created

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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: insertError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .insert({
        salon_id: staffProfile.salon_id,
        service_id: data.serviceId,
        product_id: data.productId,
        quantity_per_service: data.quantityPerService,
        is_required: data.isRequired || false,
        created_by_id: user.id,
        updated_by_id: user.id,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: updateError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .update({
        service_id: data.serviceId,
        product_id: data.productId,
        quantity_per_service: data.quantityPerService,
        is_required: data.isRequired || false,
        updated_by_id: user.id,
      })
      .eq('id', id)
      .eq('salon_id', staffProfile.salon_id)

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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) return { error: 'User salon not found' }

    const { error: deleteError } = await supabase
      .schema('inventory')
      .from('service_product_usage')
      .delete()
      .eq('id', id)

    if (deleteError) return { error: deleteError.message }

    revalidatePath('/business/services/product-usage')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to delete usage mapping' }
  }
}
