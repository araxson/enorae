export type PricingRuleRecord = {
  id: string | null
  rule_name: string | null
  rule_type: string | null
  service_id: string | null
  multiplier: number | null
  fixed_adjustment: number | null
  start_time: string | null
  end_time: string | null
  valid_from: string | null
  valid_until: string | null
  customer_segment: string | null
  days_of_week: number[] | null
  is_active: boolean | null
  priority: number | null
}

export interface PricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

export interface PricingScenario {
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

export interface PricingInsight {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

export interface DynamicPricingDashboardProps {
  rules: PricingRule[]
  scenarios: PricingScenario[]
  insights: PricingInsight[]
  services: { id: string }[]
}

// Re-export form state types
export type { PricingRuleFormState } from '../components/pricing-rules-form/types'
