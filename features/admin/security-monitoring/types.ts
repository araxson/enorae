export interface AdminSecurityMonitoringEvent {}

export interface AdminSecurityMonitoringFilter {}

// Re-export types from api/types.ts
export type {
  SecurityMetricStatus,
  SecurityMetric,
  SecurityOverview,
  SecurityEvent,
  AccessAttempt,
  SuspiciousSession,
  AuditEvent,
  RateLimitRule,
  RateLimitViolation,
  FailedLoginAttempt,
  GroupedFailedLoginStat,
  FailedLoginSummary,
  IpAccessEvent,
  SecurityIncident,
  SecurityMonitoringSnapshot,
} from './api/types'
