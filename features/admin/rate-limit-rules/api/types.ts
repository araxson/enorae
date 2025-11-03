export interface RateLimitRule {
  id: string
  endpoint: string
  limit_threshold: number
  window_seconds: number
  isActive: boolean
  description: string
  created_at: string
  updated_at: string
  recent_violations: number
}

export interface RateLimitRulesSnapshot {
  rules: RateLimitRule[]
  totalCount: number
  activeCount: number
  violationsTodayCount: number
}
