export interface RateLimitConfig {
  identifier: string
  limit: number
  windowSeconds: number
  namespace?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
  limit: number
}

export type RateLimitStore = Record<string, { count: number; resetTime: number }>
