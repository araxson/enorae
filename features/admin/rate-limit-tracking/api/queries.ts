import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

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

export async function getRateLimitTracking(
  options: { limit?: number; offset?: number } = {},
): Promise<RateLimitSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  // Fetch main rate limit tracking data
  const { data: records, error } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*')
    .order('current_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch rate limit records:', error)
    return {
      records: [],
      totalCount: 0,
      blockedCount: 0,
      warningCount: 0,
    }
  }

  // Get counts
  const { count: totalCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })

  const { count: blockedCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'blocked')

  const { count: warningCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'warning')

  return {
    records: (records as RateLimitRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    blockedCount: blockedCount ?? 0,
    warningCount: warningCount ?? 0,
  }
}

export async function getRateLimitDetail(
  recordId: string,
): Promise<RateLimitRecord | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data: record, error } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*')
    .eq('id', recordId)
    .single()

  if (error) {
    console.error('Failed to fetch rate limit detail:', error)
    return null
  }

  return (record as RateLimitRecord) ?? null
}

export async function getRateLimitRules() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data: rules, error } = await supabase
    .from('security_rate_limit_rules_view')
    .select('*')
    .order('endpoint', { ascending: true })

  if (error) {
    console.error('Failed to fetch rate limit rules:', error)
    return []
  }

  return rules ?? []
}
