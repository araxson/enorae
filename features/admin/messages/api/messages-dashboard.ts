import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { LOOKBACK_DAYS } from './constants'
import { buildModerationArtifacts } from './message-dashboard-artifacts'
import {
  buildActivitySeries,
  buildMessageStats,
  buildReportSummary,
  calculateThreadInsights,
} from './message-dashboard-analytics'
import { buildThreadMap, groupMessagesByThread } from './message-dashboard-helpers'
import type {
  AdminMessageRow,
  Json,
  MessageRow,
  MessageThreadRow,
  MessagesDashboardData,
} from './types'

export async function getMessagesDashboard(): Promise<MessagesDashboardData> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data: threadsData, error: threadsError } = await supabase
    .from('admin_messages_overview')
    .select('*')
    .order('last_message_at', { ascending: false })

  if (threadsError) {
    throw threadsError
  }

  const threads = (threadsData ?? []) as AdminMessageRow[]
  const threadIds = threads.map((thread) => thread.id).filter((id): id is string => Boolean(id))

  let threadMetadataMap = new Map<string, Json | null>()
  if (threadIds.length) {
    const { data: threadMetaRows, error: threadMetaError } = await supabase
      .from('message_threads')
      .select('id, metadata')
      .in('id', threadIds)

    if (!threadMetaError && threadMetaRows) {
      threadMetadataMap = new Map(
        (threadMetaRows as Pick<MessageThreadRow, 'id' | 'metadata'>[])
          .filter((row): row is Pick<MessageThreadRow, 'id' | 'metadata'> & { id: string } => Boolean(row.id))
          .map((row) => [row.id, row.metadata]),
      )
    }
  }

  const lookbackStart = new Date()
  lookbackStart.setDate(lookbackStart.getDate() - (LOOKBACK_DAYS - 1))
  lookbackStart.setHours(0, 0, 0, 0)

  let recentMessages: MessageRow[] = []
  if (threadIds.length) {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('id, context_id, context_type, content, created_at, from_user_id, metadata')
      .eq('context_type', 'thread')
      .in('context_id', threadIds)
      .gte('created_at', lookbackStart.toISOString())
      .order('created_at', { ascending: true })

    if (!messagesError && messagesData) {
      recentMessages = messagesData as MessageRow[]
    } else if (messagesError) {
      console.error('admin_messages_overview: failed to load recent messages', messagesError)
    }
  }

  const threadMap = buildThreadMap(threads)
  const messagesByThread = groupMessagesByThread(recentMessages, threadMap)
  const moderationArtifacts = buildModerationArtifacts(recentMessages, threadMap)

  const { threadsWithInsights, firstResponseDurations, responsesWithinHour } = calculateThreadInsights(
    threads,
    threadMetadataMap,
    messagesByThread,
    moderationArtifacts,
  )

  const stats = buildMessageStats(
    threads,
    threadsWithInsights,
    firstResponseDurations,
    responsesWithinHour,
    moderationArtifacts.flaggedMessagesCount,
  )

  const activity = buildActivitySeries(moderationArtifacts.activityMap)
  const reportSummary = buildReportSummary(threadsWithInsights, threadMetadataMap)
  const moderationQueue = moderationArtifacts.moderationQueue.slice(0, 50)

  return {
    threads: threadsWithInsights,
    stats,
    moderationQueue,
    activity,
    reportSummary,
  }
}
