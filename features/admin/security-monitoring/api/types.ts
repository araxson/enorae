export type SecurityMetricStatus = 'ok' | 'healthy' | 'warning' | 'critical' | 'info' | 'unknown'

export interface SecurityMetric {
  key: string
  label: string
  value: number
  status: SecurityMetricStatus
  threshold: number | null
  trend?: number | null
}

export interface SecurityOverview {
  totalAuditEvents: number
  highSeverityEvents: number
  failedLoginAttempts: number
  activeIncidents: number
  blockedSessions: number
}

export interface SecurityEvent {
  id: string
  eventType: string
  severity: string
  eventCategory: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  userId: string | null
  userEmail?: string | null
  ipAddress: string | null
  createdAt: string
}

export interface AccessAttempt {
  id: string
  userId: string | null
  resourceType: string
  action: string
  isGranted: boolean
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface SuspiciousSession {
  id: string
  userId: string | null
  ipAddress: string | null
  userAgent: string | null
  suspiciousScore: number | null
  isBlocked: boolean | null
  lastActivityAt: string | null
  createdAt: string | null
}

export interface AuditEvent {
  id: string
  eventType: string
  eventCategory: string | null
  severity: string
  userId: string | null
  action: string | null
  entityType: string | null
  isSuccess: boolean | null
  errorMessage: string | null
  createdAt: string
}

export interface RateLimitRule {
  id: string
  ruleName: string
  endpoint: string
  appliesTo: string
  maxRequests: number
  windowSeconds: number
  blockDurationSeconds: number | null
  isActive: boolean
}

export interface RateLimitViolation {
  id: string
  identifier: string
  identifierType: string
  endpoint: string
  requestCount: number
  windowStartAt: string
  lastRequestAt: string | null
  lastBlockedAt: string | null
  blockedUntil: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
}

export interface FailedLoginAttempt {
  id: string
  userId: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  metadata: Record<string, unknown> | null
}

export interface GroupedFailedLoginStat {
  label: string
  attempts: number
}

export interface FailedLoginSummary {
  total: number
  last24h: number
  attempts: FailedLoginAttempt[]
  byIp: GroupedFailedLoginStat[]
  byUser: GroupedFailedLoginStat[]
}

export interface IpAccessEvent {
  id: string
  ipAddress: string | null
  isGranted: boolean
  resourceType: string
  action: string
  userId: string | null
  userAgent: string | null
  createdAt: string
}

export interface SecurityIncident {
  id: string
  eventType: string
  severity: string
  description: string | null
  userId: string | null
  ipAddress: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface SecurityMonitoringSnapshot {
  timeframe: {
    start: string
    end: string
  }
  overview: SecurityOverview
  metrics: SecurityMetric[]
  recentEvents: SecurityEvent[]
  accessAttempts: AccessAttempt[]
  suspiciousSessions: SuspiciousSession[]
  failedLoginSummary: FailedLoginSummary
  rateLimitViolations: RateLimitViolation[]
  rateLimitRules: RateLimitRule[]
  ipAccess: IpAccessEvent[]
  incidents: SecurityIncident[]
}
