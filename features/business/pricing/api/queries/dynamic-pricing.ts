import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type ServicePricingView = Database['public']['Views']['service_pricing_view']['Row']

export async function applyDynamicPricing(
  basePrice: number,
  serviceId: string,
  appointmentTime: string,
  salonId: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // NOTE: pricing_rules table doesn't exist in schema
  // Dynamic pricing functionality is currently not implemented
  // Return base price as-is
  // TODO: Implement dynamic pricing when pricing_rules table is added to database

  return Math.round(basePrice * 100) / 100
}

export async function calculateServicePrice(
  serviceId: string,
  customerId: string,
  bookingTime: string
): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get service pricing - price is stored in service_pricing table, not services table
  const { data: pricing, error: pricingError } = await supabase
    .from('service_pricing_view')
    .select('*')
    .eq('service_id', serviceId)
    .maybeSingle<ServicePricingView>()

  if (pricingError) throw pricingError
  if (!pricing) return 0

  // Use current_price, fallback to sale_price, then base_price
  const basePrice = pricing['current_price'] ?? pricing['sale_price'] ?? pricing['base_price'] ?? 0

  // Apply dynamic pricing
  return applyDynamicPricing(
    basePrice,
    serviceId,
    bookingTime,
    pricing['salon_id'] ?? ''
  )
}

export async function getPricingRules(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // NOTE: pricing_rules table doesn't exist in schema
  // Return empty array until table is added
  // TODO: Query from catalog.pricing_rules when table exists
  return []
}
