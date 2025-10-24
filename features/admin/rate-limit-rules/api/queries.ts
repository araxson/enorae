import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export interface RateLimitRule {
  id: string
  endpoint: string
  limit_threshold: number
  window_seconds: number
  active: boolean
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

export async function getRateLimitRules(
  options: { limit?: number; offset?: number } = {},
): Promise<RateLimitRulesSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  // Fetch rate limit rules
  const { data: rules, error } = await supabase
    .from('security_rate_limit_rules_view')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch rate limit rules:', error)
    return {
      rules: [],
      totalCount: 0,
      activeCount: 0,
      violationsTodayCount: 0,
    }
  }

  // Get counts
  const { count: totalCount } = await supabase
    .from('security_rate_limit_rules_view')
    .select('*', { count: 'exact', head: true })

  const { count: activeCount } = await supabase
    .from('security_rate_limit_rules_view')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  // Count violations today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: violationsTodayCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })
    .gte('last_attempt', today.toISOString())

  return {
    rules: (rules as RateLimitRule[]) ?? [],
    totalCount: totalCount ?? 0,
    activeCount: activeCount ?? 0,
    violationsTodayCount: violationsTodayCount ?? 0,
  }
}
