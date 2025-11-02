'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

// NOTE: pricing_rules table does not exist in database
// Dynamic pricing is handled through service_pricing table
// This functionality is deprecated and should use service_pricing instead

export async function createPricingRule(_input: unknown) {
  const logger = createOperationLogger('createPricingRule', {})
  logger.start()

  throw new Error('createPricingRule is deprecated - use service_pricing table instead')
}

export interface BulkPricingAdjustmentInput {
  salon_id: string
  service_ids: string[]
  adjustment_type: 'percentage' | 'fixed'
  adjustment_value: number
  reason?: string
}

export async function bulkAdjustPricing(input: BulkPricingAdjustmentInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (input.service_ids.length === 0) return { updated: 0 }

  // NOTE: services table does not have a 'price' column
  // Pricing is stored in service_pricing table with service_id foreign key
  const { data: pricingRecords, error: fetchError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .select('id, service_id, base_price')
    .in('service_id', input.service_ids)

  if (fetchError) throw fetchError

  const now = new Date().toISOString()

  // PERFORMANCE FIX: Calculate all new prices and update in batch instead of N+1
  const updates = (pricingRecords || []).map((pricing) => {
    const basePrice = Number(pricing.base_price || 0)
    const newPrice =
      input.adjustment_type === 'percentage'
        ? basePrice * (1 + input.adjustment_value / 100)
        : basePrice + input.adjustment_value

    return {
      id: pricing.id,
      base_price: Number(newPrice.toFixed(2)),
      updated_at: now,
    }
  })

  // Update all pricing records in parallel
  const updatePromises = updates.map((update) =>
    supabase
      .schema('catalog')
      .from('service_pricing')
      .update({
        base_price: update.base_price,
        updated_at: update.updated_at,
      })
      .eq('id', update.id)
  )

  const results = await Promise.all(updatePromises)
  const errors = results.filter((r) => r.error)
  if (errors.length > 0 && errors[0]) {
    throw errors[0].error
  }

  revalidatePath('/business/services/pricing', 'page')
  revalidatePath('/business/pricing', 'page')
  return { updated: updates.length }
}

export async function updatePricingRule(_id: string, _input: unknown) {
  throw new Error('updatePricingRule is deprecated - use service_pricing table instead')
}

export async function deletePricingRule(_id: string) {
  throw new Error('deletePricingRule is deprecated - use service_pricing table instead')
}

export async function togglePricingRuleStatus(_id: string, _isActive: boolean) {
  throw new Error('togglePricingRuleStatus is deprecated - use service_pricing table instead')
}
