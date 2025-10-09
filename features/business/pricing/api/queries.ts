import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export interface DynamicPricing {
  service_id: string
  service_name: string
  base_price: number
  current_price: number
  time_based_price: number
  demand_based_price: number
  final_price: number
  discount_percentage: number
  surge_percentage: number
}

export interface PricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

// Simulated pricing rules (in production, these would come from a database table)
const DEFAULT_PRICING_RULES: PricingRule[] = [
  // Weekend surges
  { day_of_week: 'saturday', hour_start: 10, hour_end: 18, adjustment_type: 'surge', adjustment_percentage: 20 },
  { day_of_week: 'sunday', hour_start: 10, hour_end: 18, adjustment_type: 'surge', adjustment_percentage: 15 },

  // Weekday discounts
  { day_of_week: 'monday', hour_start: 9, hour_end: 12, adjustment_type: 'discount', adjustment_percentage: 15 },
  { day_of_week: 'tuesday', hour_start: 9, hour_end: 12, adjustment_type: 'discount', adjustment_percentage: 15 },
  { day_of_week: 'wednesday', hour_start: 14, hour_end: 17, adjustment_type: 'discount', adjustment_percentage: 10 },

  // Evening surges
  { day_of_week: 'friday', hour_start: 17, hour_end: 21, adjustment_type: 'surge', adjustment_percentage: 25 },
  { day_of_week: 'thursday', hour_start: 17, hour_end: 20, adjustment_type: 'surge', adjustment_percentage: 15 },
]

export async function calculateDynamicPricing(
  serviceId: string,
  appointmentTime: string
): Promise<number> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get base price
  const { data: pricing } = await supabase
    .from('service_pricing')
    .select('base_price')
    .eq('service_id', serviceId)
    .single()

  if (!pricing) {
    throw new Error('Service pricing not found')
  }

  // Call the database function for dynamic pricing
  const { data: dynamicPrice, error } = await supabase.rpc('apply_dynamic_pricing', {
    p_base_price: pricing.base_price,
    p_service_id: serviceId,
    p_appointment_time: appointmentTime,
    p_salon_id: salonId,
  })

  if (error) throw error

  return dynamicPrice as number
}

export async function getServicePricingAnalysis(serviceId?: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  let query = supabase
    .from('services')
    .select(`
      id,
      name,
      service_pricing (
        base_price,
        sale_price,
        current_price
      )
    `)
    .eq('salon_id', salonId)
    .eq('is_active', true)

  if (serviceId) {
    query = query.eq('id', serviceId)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}

export async function simulatePricingScenarios(serviceId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select(`
      id,
      name,
      service_pricing (
        base_price
      )
    `)
    .eq('id', serviceId)
    .single()

  if (!service || !service.service_pricing) {
    throw new Error('Service not found')
  }

  const basePrice = service.service_pricing[0]?.base_price || 0
  const scenarios = []

  // Generate scenarios for different times
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const hours = [9, 12, 15, 18]

  for (const day of daysOfWeek) {
    for (const hour of hours) {
      const rule = findApplicableRule(day, hour)
      let adjustedPrice = basePrice

      if (rule) {
        if (rule.adjustment_type === 'discount') {
          adjustedPrice = basePrice * (1 - rule.adjustment_percentage / 100)
        } else {
          adjustedPrice = basePrice * (1 + rule.adjustment_percentage / 100)
        }
      }

      scenarios.push({
        day,
        hour,
        base_price: basePrice,
        adjusted_price: adjustedPrice,
        adjustment_type: rule?.adjustment_type || 'none',
        adjustment_percentage: rule?.adjustment_percentage || 0,
      })
    }
  }

  return scenarios
}

function findApplicableRule(dayOfWeek: string, hour: number): PricingRule | undefined {
  return DEFAULT_PRICING_RULES.find(
    rule =>
      rule.day_of_week === dayOfWeek &&
      hour >= rule.hour_start &&
      hour < rule.hour_end
  )
}

export async function getPricingRules() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  return DEFAULT_PRICING_RULES
}

export async function getPricingInsights() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all active services
  const { data: services } = await supabase
    .from('services')
    .select(`
      id,
      name,
      service_pricing (
        base_price,
        sale_price
      )
    `)
    .eq('salon_id', salonId)
    .eq('is_active', true)

  if (!services) return []

  // Calculate potential revenue impact
  const insights = services.map((service: any) => {
    const basePrice = service.service_pricing?.[0]?.base_price || 0
    const avgDiscount = 0.12 // 12% average off-peak discount
    const avgSurge = 0.18 // 18% average peak surge

    return {
      service_id: service.id,
      service_name: service.name,
      base_price: basePrice,
      avg_off_peak_price: basePrice * (1 - avgDiscount),
      avg_peak_price: basePrice * (1 + avgSurge),
      potential_revenue_increase: basePrice * avgSurge * 0.3, // 30% of bookings in peak times
    }
  })

  return insights
}
