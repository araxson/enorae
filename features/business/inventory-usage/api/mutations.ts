'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const recordUsageSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX).optional().nullable(),
  appointmentId: z.string().regex(UUID_REGEX).optional().nullable(),
  productId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

const bulkUsageItemSchema = z.object({
  productId: z.string().regex(UUID_REGEX),
  quantity: z.number().positive(),
})

const bulkRecordUsageSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX).optional().nullable(),
  appointmentId: z.string().regex(UUID_REGEX).optional().nullable(),
  products: z.array(bulkUsageItemSchema).min(1),
  notes: z.string().max(500).optional().or(z.literal('')),
})

const updateUsageRateSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX),
  productId: z.string().regex(UUID_REGEX),
  rate: z.number().positive(),
})

const deleteUsageSchema = z.object({
  usageId: z.string().regex(UUID_REGEX),
})

const USAGE_PATH = '/business/inventory/usage'
const INVENTORY_SCHEMA = 'inventory'

export async function recordProductUsage(formData: FormData) {
  try {
    const parsed = recordUsageSchema.safeParse({
      serviceId: formData.get('serviceId') || null,
      appointmentId: formData.get('appointmentId') || null,
      productId: formData.get('productId'),
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

    const { error: insertError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('product_usage')
      .insert({
        salon_id: salonId,
        product_id: data.productId,
        service_id: data.serviceId || null,
        appointment_id: data.appointmentId || null,
        quantity_used: data.quantity,
        performed_by_id: session.user.id,
        notes: data.notes || null,
      })

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

export async function bulkRecordUsage(formData: FormData) {
  try {
    const productsStr = formData.get('products') as string
    const products = productsStr ? JSON.parse(productsStr) : []

    const parsed = bulkRecordUsageSchema.safeParse({
      serviceId: formData.get('serviceId') || null,
      appointmentId: formData.get('appointmentId') || null,
      products,
      notes: formData.get('notes'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    const usageRecords = data.products.map((product) => ({
      salon_id: salonId,
      product_id: product.productId,
      service_id: data.serviceId || null,
      appointment_id: data.appointmentId || null,
      quantity_used: product.quantity,
      performed_by_id: session.user.id,
      notes: data.notes || null,
    }))

    const { error: insertError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('product_usage')
      .insert(usageRecords)

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath(USAGE_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to bulk record usage',
    }
  }
}

export async function updateUsageRate(formData: FormData) {
  try {
    const parsed = updateUsageRateSchema.safeParse({
      serviceId: formData.get('serviceId'),
      productId: formData.get('productId'),
      rate: formData.get('rate') ? parseFloat(formData.get('rate') as string) : undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    // Check if service-product usage record exists
    const { data: existingRate } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('service_product_usage')
      .select('id')
      .eq('service_id', data.serviceId)
      .eq('product_id', data.productId)
      .eq('salon_id', salonId)
      .single()

    if (existingRate) {
      // Update existing rate
      const { error: updateError } = await supabase
        .schema(INVENTORY_SCHEMA)
        .from('service_product_usage')
        .update({ quantity_per_service: data.rate })
        .eq('id', existingRate.id)

      if (updateError) {
        return { error: updateError.message }
      }
    } else {
      // Create new rate
      const { error: insertError } = await supabase
        .schema(INVENTORY_SCHEMA)
        .from('service_product_usage')
        .insert({
          salon_id: salonId,
          service_id: data.serviceId,
          product_id: data.productId,
          quantity_per_service: data.rate,
        })

      if (insertError) {
        return { error: insertError.message }
      }
    }

    revalidatePath(USAGE_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update usage rate',
    }
  }
}

export async function deleteUsageTracking(formData: FormData) {
  try {
    const parsed = deleteUsageSchema.safeParse({
      usageId: formData.get('usageId'),
    })

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message }
    }

    const data = parsed.data
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const salonId = await requireUserSalonId()
    const supabase = await createClient()

    // Verify ownership
    const { data: usage } = await supabase
      .from('product_usage')
      .select('salon_id')
      .eq('id', data.usageId)
      .single()

    if (!usage || usage.salon_id !== salonId) {
      return { error: 'Usage record not found or unauthorized' }
    }

    const { error: deleteError } = await supabase
      .schema(INVENTORY_SCHEMA)
      .from('product_usage')
      .delete()
      .eq('id', data.usageId)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath(USAGE_PATH)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete usage tracking',
    }
  }
}
