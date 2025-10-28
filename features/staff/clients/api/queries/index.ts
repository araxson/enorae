// Client list operations
export { getStaffClients } from './client-list'
export type { ClientWithHistory } from './client-list'

// Client details operations
export { getClientDetail } from './client-details'
export type { ClientDetail } from './client-details'

// Client history operations
export { getClientAppointmentHistory, getClientServiceHistory } from './client-history'
export type { ClientServiceHistory } from './client-history'

// Client retention metrics
export { getClientRetentionMetrics } from './client-retention'
export type { ClientRetentionMetrics } from './client-retention'
