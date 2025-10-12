import type { RuleType } from './constants'

export interface PricingRulesFormProps {
  salonId: string
  services: Array<{ id: string; name: string; price?: number }>
  onSuccess?: () => void
}

export interface PricingRuleFormState {
  rule_type: RuleType
  rule_name: string
  service_id: string
  multiplier: number
  fixed_adjustment: number
  start_time: string
  end_time: string
  days_of_week: number[]
  valid_from: string
  valid_until: string
  customer_segment: string
  is_active: boolean
  priority: number
}
