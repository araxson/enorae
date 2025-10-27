'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// NOTE: pricing_rules table does not exist in database
// Dynamic pricing is handled through service_pricing table
// This functionality is deprecated and should use service_pricing instead

export async function createPricingRule(_input: unknown) {
  throw new Error('createPricingRule is deprecated - use service_pricing table instead')
}

interface BulkPricingAdjustmentInput {
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

  let updated = 0
  const now = new Date().toISOString()

  for (const pricing of pricingRecords || []) {
    const basePrice = Number(pricing.base_price || 0)
    const newPrice =
      input.adjustment_type === 'percentage'
        ? basePrice * (1 + input.adjustment_value / 100)
        : basePrice + input.adjustment_value

    const { error: updateError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .update({
        base_price: Number(newPrice.toFixed(2)),
        updated_at: now,
      })
      .eq('id', pricing.id)

    if (updateError) throw updateError
    updated += 1
  }

  revalidatePath('/business/services/pricing', 'page')
  revalidatePath('/business/pricing', 'page')
  return { updated }
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
