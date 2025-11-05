// Barrel export for security-access-monitoring API
export {
  getSecurityAccessMonitoring,
  getSecurityAccessDetail,
  type SecurityAccessRecord,
  type SecurityAccessSnapshot,
} from './queries'
export {
  acknowledgeSecurityAlert,
  dismissSecurityAlert,
  suppressSecurityAlert,
} from './mutations'
