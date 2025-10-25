export interface RateLimitRecord {
  identifier: string
  endpoint: string
  identifierType: string | null
  requestCount: number
  maxRequests: number | null
  usagePercent: number | null
  windowStartAt: string | null
  windowEndAt: string | null
  status: 'active' | 'blocked' | 'warning'
  blockedUntil: string | null
  lastBlockedAt: string | null
  lastRequestAt: string | null
  userAgent: string | null
}

export interface RateLimitSnapshot {
  records: RateLimitRecord[]
  totalCount: number
  blockedCount: number
  warningCount: number
}

export interface RateLimitRule {
  id: string | null
  endpoint: string | null
  maxRequests: number | null
  windowSeconds: number | null
  isActive: boolean | null
  createdAt: string | null
  updatedAt: string | null
}
