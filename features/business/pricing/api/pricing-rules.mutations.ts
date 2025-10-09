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
