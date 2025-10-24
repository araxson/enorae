export interface RateLimitRecord {
  id: string
  identifier: string
  endpoint: string
  limit_threshold: number
  current_count: number
  window_start: string
  window_end: string
  status: 'active' | 'blocked' | 'warning'
  last_attempt: string
  next_reset: string
}

export interface RateLimitSnapshot {
  records: RateLimitRecord[]
  totalCount: number
  blockedCount: number
  warningCount: number
}

export interface RateLimitRule {
  id: string
  endpoint: string
  limit_threshold: number
  window_seconds: number
  active: boolean
  created_at: string
  updated_at: string
}
