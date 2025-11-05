import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/guards-simple'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type ServicePricingView = Database['public']['Views']['service_pricing_view']['Row']

export async function applyDynamicPricing(
  basePrice: number,
  serviceId: string,
  appointmentTime: string,
  salonId: string
): Promise<number> {
  const logger = createOperationLogger('applyDynamicPricing', {})
  logger.start()

  await requireUser()

  /**
   * NOTE: Dynamic pricing is not yet implemented as pricing_rules table
   * is not present in the current database schema.
   *
   * Future enhancement: Implement dynamic pricing rules when the
   * pricing_rules table is added to the catalog schema.
   */

  return Math.round(basePrice * 100) / 100
}

export async function calculateServicePrice(
  serviceId: string,
  customerId: string,
  bookingTime: string
): Promise<number> {
  await requireUser()
  const supabase = await createClient()

  // Get service pricing - price is stored in service_pricing table, not services table
  const { data: pricing, error: pricingError } = await supabase
    .from('service_pricing_view')
    .select('id, service_id, service_name, salon_id, base_price, min_price, max_price, pricing_type, created_at, updated_at, deleted_at')
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

type PricingRule = {
  id: string
  name: string
  description: string | null
  is_active: boolean
}

export async function getPricingRules(salonId: string): Promise<PricingRule[]> {
  await requireUser()

  /**
   * NOTE: pricing_rules table doesn't exist in current schema.
   * Returns empty array until the table is added to catalog schema.
   *
   * Future enhancement: Query from catalog.pricing_rules when available.
   */
  return []
}
