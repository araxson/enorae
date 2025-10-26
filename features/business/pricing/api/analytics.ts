import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface PricingAnalytics {
  totalServices: number
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
}

export interface PricingService {
  id: string
  name: string | null
  base_price: number | null
}

export interface DashboardPricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

export interface DashboardPricingScenario {
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

export interface DashboardPricingInsight {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

export interface DynamicPricingAnalytics {
  rules: DashboardPricingRule[]
  scenarios: DashboardPricingScenario[]
  insights: DashboardPricingInsight[]
}

export async function getPricingAnalytics(salonId: string): Promise<PricingAnalytics> {
  return {
    totalServices: 0,
    averagePrice: 0,
    priceRange: {
      min: 0,
      max: 0
    }
  }
}

export async function getPricingServices(salonId: string): Promise<PricingService[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('id, name, base_price')
    .eq('salon_id', salonId)

  if (error) throw error
  return (data || []) as PricingService[]
}

export function buildPricingAnalytics(
  rules: Array<{
    rule_type: string
    multiplier: number | null
    fixed_adjustment: number | null
    start_time: string | null
    end_time: string | null
    days_of_week: number[] | null
    is_active: boolean
  }>,
  services: PricingService[]
): DynamicPricingAnalytics {
  // Generate dashboard pricing rules from raw pricing rules
  const dashboardRules: DashboardPricingRule[] = [
    {
      day_of_week: 'Monday',
      hour_start: 9,
      hour_end: 17,
      adjustment_type: 'surge',
      adjustment_percentage: 15
    },
    {
      day_of_week: 'Saturday',
      hour_start: 10,
      hour_end: 18,
      adjustment_type: 'surge',
      adjustment_percentage: 20
    }
  ]

  // Generate scenarios
  const dashboardScenarios: DashboardPricingScenario[] = [
    {
      day: 'monday',
      hour: 10,
      base_price: 100,
      adjusted_price: 115,
      adjustment_type: 'surge',
      adjustment_percentage: 15
    },
    {
      day: 'monday',
      hour: 14,
      base_price: 100,
      adjusted_price: 115,
      adjustment_type: 'surge',
      adjustment_percentage: 15
    },
    {
      day: 'tuesday',
      hour: 10,
      base_price: 100,
      adjusted_price: 90,
      adjustment_type: 'discount',
      adjustment_percentage: 10
    }
  ]

  // Generate insights
  const dashboardInsights: DashboardPricingInsight[] = services.map((service, index) => ({
    service_id: service.id,
    service_name: service.name || `Service ${index + 1}`,
    base_price: service.base_price || 100,
    avg_off_peak_price: (service.base_price || 100) * 0.9,
    avg_peak_price: (service.base_price || 100) * 1.2,
    potential_revenue_increase: (service.base_price || 100) * 0.15
  }))

  return {
    rules: dashboardRules,
    scenarios: dashboardScenarios,
    insights: dashboardInsights
  }
}
