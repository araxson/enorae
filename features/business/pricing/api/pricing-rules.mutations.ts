'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface PricingRuleInput {
  salon_id: string
  service_id?: string | null
  rule_type: string
  rule_name: string
  multiplier?: number
  fixed_adjustment?: number
  start_time?: string | null
  end_time?: string | null
  days_of_week?: number[] | null
  min_advance_hours?: number | null
  max_advance_hours?: number | null
  valid_from?: string | null
  valid_until?: string | null
  customer_segment?: string | null
  seasonal_tag?: string | null
  is_active: boolean
  priority: number
}

export async function createPricingRule(input: PricingRuleInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('pricing_rules')
    .insert(input)

  if (error) throw error

  revalidatePath('/business/services/pricing')
  revalidatePath('/business/pricing')
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

  const { data: services, error: fetchError } = await supabase
    .schema('catalog')
    .from('services')
    .select('id, price')
    .in('id', input.service_ids)

  if (fetchError) throw fetchError

  let updated = 0
  const now = new Date().toISOString()

  for (const service of services || []) {
    const basePrice = Number(service.price || 0)
    const newPrice =
      input.adjustment_type === 'percentage'
        ? basePrice * (1 + input.adjustment_value / 100)
        : basePrice + input.adjustment_value

    const { error: updateError } = await supabase
      .schema('catalog')
      .from('services')
      .update({
        price: Number(newPrice.toFixed(2)),
        updated_at: now,
      })
      .eq('id', service.id)

    if (updateError) throw updateError
    updated += 1
  }

  revalidatePath('/business/services/pricing')
  revalidatePath('/business/pricing')
  return { updated }
}

export async function updatePricingRule(id: string, input: Partial<PricingRuleInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('pricing_rules')
    .update(input)
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/services/pricing')
  revalidatePath('/business/pricing')
}

export async function deletePricingRule(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('pricing_rules')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/services/pricing')
  revalidatePath('/business/pricing')
}

export async function togglePricingRuleStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('pricing_rules')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/services/pricing')
  revalidatePath('/business/pricing')
}
