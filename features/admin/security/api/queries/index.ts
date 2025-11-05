// Re-export audit log queries
export { getAuditLogs, getSecurityOverview, getSecurityEvents } from './audit-logs'
export type { AuditLog, SecurityEvent } from './audit-logs'

// Re-export security event queries (different shape - using alternative names)
export {
  getCriticalSecurityEvents,
  getFailedAuthAttempts,
} from './events'

// Re-export security metrics queries
export {
  getAdminActivitySummary,
  getSystemHealthMetrics,
  getDataIntegrityAlerts,
} from './metrics'
