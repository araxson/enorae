import type { Database, Json } from '@/lib/types/database.types'

export type AdminMessageRow = Database['public']['Views']['admin_messages_overview']['Row']
export type MessageThreadRow = Database['public']['Views']['message_threads']['Row']
export type MessageRow = Database['public']['Views']['messages']['Row']

export type ThreadStatus = Database['public']['Enums']['thread_status']
export type ThreadPriority = Database['public']['Enums']['thread_priority']

export type MessageThreadWithInsights = AdminMessageRow & {
  hasFlaggedMessages: boolean
  flaggedMessageCount: number
  unresolvedReports: number
  firstResponseMinutes: number | null
  recentMessageCount: number
}

export interface MessageStats {
  totalThreads: number
  openThreads: number
  inProgressThreads: number
  resolvedThreads: number
  closedThreads: number
  archivedThreads: number
  urgentThreads: number
  highPriorityThreads: number
  totalUnread: number
  avgFirstResponseMinutes: number | null
  responsesWithinHourRate: number | null
  totalMeasuredResponses: number
  flaggedMessages: number
  flaggedThreads: number
  openEscalations: number
}

export interface ModerationQueueItem {
  id: string
  threadId: string | null
  content: string
  createdAt: string
  reason: string
  severity: 'low' | 'medium' | 'high'
  status: string
  customerName: string | null
  salonName: string | null
}

export interface MessageActivityPoint {
  date: string
  inbound: number
  outbound: number
  avgResponseMinutes: number | null
}

export interface MessageReportSummary {
  totalReports: number
  openReports: number
  resolvedReports: number
  pendingReports: number
}

export interface MessagesDashboardData {
  threads: MessageThreadWithInsights[]
  stats: MessageStats
  moderationQueue: ModerationQueueItem[]
  activity: MessageActivityPoint[]
  reportSummary: MessageReportSummary
}

export interface ParsedModeration {
  isFlagged: boolean
  reason: string
  severity: 'low' | 'medium' | 'high'
  status: string
}

export interface ParsedThreadMetadata {
  totalReports: number
  openReports: number
  pendingReports: number
}

export interface FirstResponseResult {
  minutes: number | null
  firstCustomerMessageAt: string | null
}

export type { Json }
