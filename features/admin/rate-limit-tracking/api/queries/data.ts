import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Database, Json } from '@/lib/types/database.types'
import type { RateLimitRecord, RateLimitSnapshot, RateLimitRule } from '@/features/admin/rate-limit-tracking/api/types'
import { createOperationLogger } from '@/lib/observability'

type TrackingRow = Database['public']['Views']['security_rate_limit_tracking_view']['Row']
type RuleRow = Database['public']['Views']['security_rate_limit_rules_view']['Row']

type RuleMap = Map<string, RuleRow>

const toSafeString = (value: string | null | undefined, fallback = 'unknown'): string =>
  typeof value === 'string' && value.length > 0 ? value : fallback

const calculateWindowEnd = (startAt: string | null, windowSeconds: number | null): string | null => {
  if (!startAt || !windowSeconds) {
    return null
  }

  const startDate = new Date(startAt)
  if (Number.isNaN(startDate.getTime())) {
    return null
  }

  const endDate = new Date(startDate.getTime() + windowSeconds * 1000)
  return endDate.toISOString()
}

const extractMaxRequests = (rule: RuleRow | undefined, metadata: Json | null): number | null => {
  if (rule?.max_requests !== null && rule?.max_requests !== undefined) {
    return rule.max_requests
  }

  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
    return null
  }

  const rawThreshold = (metadata as Record<string, unknown>)['limit_threshold']
  return typeof rawThreshold === 'number' ? rawThreshold : null
}

const deriveUsagePercent = (current: number, max: number | null): number | null => {
  if (!max || max <= 0) {
    return null
  }

  return Math.min(100, Math.round((current / max) * 100))
}

const deriveStatus = (blockedUntil: string | null, usagePercent: number | null): 'active' | 'blocked' | 'warning' => {
  if (blockedUntil) {
    const blockedDate = new Date(blockedUntil)
    if (!Number.isNaN(blockedDate.getTime()) && blockedDate.getTime() > Date.now()) {
      return 'blocked'
    }
  }

  if (usagePercent !== null && usagePercent >= 90) {
    return 'warning'
  }

  return 'active'
}

const normalizeRecord = (row: TrackingRow, ruleMap: RuleMap): RateLimitRecord => {
  const endpoint = toSafeString(row.endpoint)
  const associatedRule = ruleMap.get(endpoint)
  const maxRequests = extractMaxRequests(associatedRule, row.metadata ?? null)
  const usagePercent = deriveUsagePercent(row.request_count ?? 0, maxRequests)

  return {
    identifier: toSafeString(row.identifier),
    endpoint,
    identifierType: row.identifier_type ?? null,
    requestCount: row.request_count ?? 0,
    maxRequests,
    usagePercent,
    windowStartAt: row.window_start_at ?? null,
    windowEndAt: calculateWindowEnd(row.window_start_at ?? null, associatedRule?.window_seconds ?? null),
    status: deriveStatus(row.blocked_until ?? null, usagePercent),
    blockedUntil: row.blocked_until ?? null,
    lastBlockedAt: row.last_blocked_at ?? null,
    lastRequestAt: row.last_request_at ?? null,
    userAgent: typeof row.user_agent === 'string' ? row.user_agent : null,
  }
}

const buildRuleMap = (rules: RuleRow[] | null): RuleMap => {
  const map: RuleMap = new Map()
  if (!rules) {
    return map
  }

  for (const rule of rules) {
    const key = toSafeString(rule.endpoint)
    map.set(key, rule)
  }

  return map
}

const mapRule = (rule: RuleRow): RateLimitRule => ({
  id: rule.id ?? null,
  endpoint: rule.endpoint ?? null,
  maxRequests: rule.max_requests ?? null,
  windowSeconds: rule.window_seconds ?? null,
  isActive: rule.is_active ?? null,
  createdAt: rule.created_at ?? null,
  updatedAt: rule.updated_at ?? null,
})

export async function getRateLimitTracking(
  options: { limit?: number; offset?: number } = {},
): Promise<RateLimitSnapshot> {
  const logger = createOperationLogger('getRateLimitTracking', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  const [{ data: trackingRows, error: trackingError }, { data: ruleRows }] = await Promise.all([
    supabase
      .from('security_rate_limit_tracking_view')
      .select('*')
      .order('request_count', { ascending: false })
      .range(offset, offset + limit - 1),
    supabase.from('security_rate_limit_rules_view').select('*'),
  ])

  if (trackingError) {
    logger.error(trackingError, 'database', { query: 'security_rate_limit_tracking_view' })
    return {
      records: [],
      totalCount: 0,
      blockedCount: 0,
      warningCount: 0,
    }
  }

  const ruleMap = buildRuleMap(ruleRows ?? null)
  const normalizedRecords = (trackingRows ?? []).map((row) => normalizeRecord(row as TrackingRow, ruleMap))

  const { count: totalCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })

  const { count: blockedCount } = await supabase
    .from('security_rate_limit_tracking_view')
    .select('*', { count: 'exact', head: true })
    .not('blocked_until', 'is', null)

  const warningCount = normalizedRecords.filter((record) => record.status === 'warning').length

  return {
    records: normalizedRecords,
    totalCount: totalCount ?? normalizedRecords.length,
    blockedCount: blockedCount ?? 0,
    warningCount,
  }
}

export async function getRateLimitDetail(identifier: string, endpoint?: string): Promise<RateLimitRecord | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  let query = supabase.from('security_rate_limit_tracking_view').select('*').eq('identifier', identifier)

  if (endpoint) {
    query = query.eq('endpoint', endpoint)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error('Failed to fetch rate limit detail:', error)
    return null
  }

  const { data: ruleRows } = await supabase
    .from('security_rate_limit_rules_view')
    .select('*')
    .eq('endpoint', endpoint ?? (data?.endpoint ?? ''))

  const ruleMap = buildRuleMap(ruleRows ?? null)
  return normalizeRecord(data as TrackingRow, ruleMap)
}

export async function getRateLimitRules(): Promise<RateLimitRule[]> {
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

  return (rules ?? []).map(mapRule)
}
