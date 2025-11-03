import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { LOOKBACK_DAYS } from '../constants'
import { buildModerationArtifacts } from './artifacts'
import {
  buildActivitySeries,
  buildMessageStats,
  buildReportSummary,
  calculateThreadInsights,
} from './analytics'
import { buildThreadMap, groupMessagesByThread } from './helpers'
import { createOperationLogger } from '@/lib/observability'
import type {
  AdminMessageRow,
  Json,
  MessageRow,
  MessageThreadRow,
  MessagesDashboardData,
} from '../../api/types'

export async function getMessagesDashboard(): Promise<MessagesDashboardData> {
  const logger = createOperationLogger('getMessagesDashboard', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  // NOTE: Messages feature not implemented - message_threads and messages tables don't exist in database
  // Database is source of truth - this feature requires proper table structure before implementation
  return {
    threads: [],
    stats: {
      totalThreads: 0,
      openThreads: 0,
      inProgressThreads: 0,
      resolvedThreads: 0,
      closedThreads: 0,
      archivedThreads: 0,
      urgentThreads: 0,
      highPriorityThreads: 0,
      totalUnread: 0,
      avgFirstResponseMinutes: 0,
      responsesWithinHourRate: 0,
      totalMeasuredResponses: 0,
      flaggedMessages: 0,
      flaggedThreads: 0,
      openEscalations: 0,
    },
    moderationQueue: [],
    activity: [],
    reportSummary: {
      totalReports: 0,
      openReports: 0,
      resolvedReports: 0,
      pendingReports: 0,
    },
  }
}
