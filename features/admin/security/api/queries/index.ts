import 'server-only'

// Re-export audit log queries
export { getAuditLogs, getSecurityEvents, getSecurityOverview } from './audit-logs'
export type { AuditLog, SecurityEvent } from './audit-logs'

// Re-export security monitoring queries
export {
  getCriticalSecurityEvents,
  getFailedAuthAttempts,
  getAdminActivitySummary,
  getSystemHealthMetrics,
  getDataIntegrityAlerts,
} from './monitoring'
