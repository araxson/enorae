'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: service_pricing and staff_profiles don't have public views yet
// Keeping .schema() calls until public views are created for catalog tables

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const pricingSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  salePrice: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  isTaxable: z.boolean().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  currencyCode: z.string().default('USD'),
})

const updatePricingSchema = pricingSchema.extend({
  id: z.string().regex(UUID_REGEX, 'Invalid pricing ID'),
})

/**
 * Create or update service pricing
 */
export async function upsertServicePricing(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()

    const result = (id ? updatePricingSchema : pricingSchema).safeParse({
      id,
      serviceId: formData.get('serviceId'),
      basePrice: parseFloat(formData.get('basePrice') as string),
      salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined,
      cost: formData.get('cost') ? parseFloat(formData.get('cost') as string) : undefined,
      taxRate: formData.get('taxRate') ? parseFloat(formData.get('taxRate') as string) : undefined,
      isTaxable: formData.get('isTaxable') === 'true',
      commissionRate: formData.get('commissionRate') ? parseFloat(formData.get('commissionRate') as string) : undefined,
      currencyCode: formData.get('currencyCode') || 'USD',
    })

    if (!result.success) {
      return { error: result.error.errors[0].message }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Verify service belongs to salon
    const { data: service } = await supabase
      .schema('catalog')
      .from('services')
      .select('salon_id')
      .eq('id', data.serviceId)
      .single()

    if (service?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Service not found for your salon' }
    }

    // Calculate current price and profit margin
    const currentPrice = data.salePrice && data.salePrice > 0 ? data.salePrice : data.basePrice
    const profitMargin = data.cost && data.cost > 0
      ? ((currentPrice - data.cost) / currentPrice) * 100
      : null

    const pricingData = {
      service_id: data.serviceId,
      base_price: data.basePrice,
      sale_price: data.salePrice || null,
      current_price: currentPrice,
      cost: data.cost || null,
      tax_rate: data.taxRate || null,
      is_taxable: data.isTaxable ?? true,
      commission_rate: data.commissionRate || null,
      profit_margin: profitMargin,
      currency_code: data.currencyCode,
      updated_by_id: user.id,
    }

    if (id) {
      // Update existing
      const { error: updateError } = await supabase
        .schema('catalog')
        .from('service_pricing')
        .update({
          ...pricingData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        return { error: updateError.message }
      }
    } else {
      // Create new
      const { error: insertError } = await supabase
        .schema('catalog')
        .from('service_pricing')
        .insert({
          ...pricingData,
          created_by_id: user.id,
        })

      if (insertError) {
        return { error: insertError.message }
      }
    }

    revalidatePath('/business/services/pricing')
    revalidatePath('/business/services')
    return { success: true }
  } catch (error) {
    console.error('Error upserting service pricing:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to save pricing',
    }
  }
}

/**
 * Delete service pricing (soft delete)
 */
export async function deleteServicePricing(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) {
      return { error: 'Invalid pricing ID' }
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    const { data: staffProfile } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('salon_id')
      .eq('user_id', user.id)
      .single()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Verify ownership
    const { data: pricing } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .select(`
        id,
        service:services!fk_service_pricing_service(salon_id)
      `)
      .eq('id', id)
      .single()

    if (pricing?.service?.salon_id !== staffProfile.salon_id) {
      return { error: 'Unauthorized: Pricing not found for your salon' }
    }

    const { error: deleteError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath('/business/services/pricing')
    revalidatePath('/business/services')
    return { success: true }
  } catch (error) {
    console.error('Error deleting service pricing:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete pricing',
    }
  }
}
