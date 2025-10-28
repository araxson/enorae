import 'server-only'

// Re-export main dashboard query
export { getMessagesDashboard } from './dashboard'

// Re-export types from parent
export type {
  MessageActivityPoint,
  MessageReportSummary,
  MessageStats,
  MessageThreadWithInsights,
  MessagesDashboardData,
  ModerationQueueItem,
} from '../types'
