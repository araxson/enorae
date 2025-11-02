import 'server-only'
import { LOOKBACK_DAYS } from '../constants'
import { parseThreadMetadata } from './moderation'
import {
  ensureActivityEntry,
  type ActivityEntry,
  type ModerationArtifacts,
} from './artifacts'
import {
  computeFirstResponse,
  normalisePriority,
  normaliseStatus,
} from './utils'
import type {
  AdminMessageRow,
  Json,
  MessageActivityPoint,
  MessageReportSummary,
  MessageRow,
  MessageStats,
  MessageThreadWithInsights,
} from '../types'

interface ThreadInsightResult {
  threadsWithInsights: MessageThreadWithInsights[]
  firstResponseDurations: number[]
  responsesWithinHour: number
}

export const calculateThreadInsights = (
  threads: AdminMessageRow[],
  threadMetadataMap: Map<string, Json | null>,
  messagesByThread: Map<string, MessageRow[]>,
  artifacts: ModerationArtifacts,
): ThreadInsightResult => {
  const firstResponseDurations: number[] = []
  let responsesWithinHour = 0

  const threadsWithInsights: MessageThreadWithInsights[] = threads.map((thread) => {
    const threadId = thread['id'] ?? ''
    const flaggedCount = artifacts.flaggedByThread.get(threadId) ?? 0
    const metadata = threadMetadataMap.get(threadId) ?? null
    const reportInfo = parseThreadMetadata(metadata)

    const responses = messagesByThread.get(threadId) ?? []
    const firstResponse = computeFirstResponse(thread, responses)

    if (firstResponse.minutes !== null) {
      firstResponseDurations.push(firstResponse.minutes)
      if (firstResponse.minutes <= 60) {
        responsesWithinHour += 1
      }
      if (firstResponse.firstCustomerMessageAt) {
        const responseDay = firstResponse.firstCustomerMessageAt.slice(0, 10)
        const entry = ensureActivityEntry(artifacts.activityMap, responseDay)
        entry.responses.push(firstResponse.minutes)
      }
    }

    return {
      ...thread,
      hasFlaggedMessages: flaggedCount > 0,
      flaggedMessageCount: flaggedCount,
      unresolvedReports: reportInfo.openReports + reportInfo.pendingReports,
      firstResponseMinutes: firstResponse.minutes,
      recentMessageCount: responses.length,
    }
  })

  return { threadsWithInsights, firstResponseDurations, responsesWithinHour }
}

export const buildMessageStats = (
  threads: AdminMessageRow[],
  threadsWithInsights: MessageThreadWithInsights[],
  firstResponseDurations: number[],
  responsesWithinHour: number,
  flaggedMessagesCount: number,
): MessageStats => {
  const totalResponses = firstResponseDurations.length
  const averageFirstResponse =
    totalResponses > 0 ? firstResponseDurations.reduce((sum, value) => sum + value, 0) / totalResponses : null

  const responsesWithinHourRate = totalResponses > 0 ? responsesWithinHour / totalResponses : null

  const statusCounts = threads.reduce<Record<string, number>>((acc, thread) => {
    const status = normaliseStatus(thread['status'])?.toString() ?? 'open'
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  const priorityCounts = threads.reduce<Record<string, number>>((acc, thread) => {
    const priority = normalisePriority(thread['priority'])?.toString() ?? 'normal'
    acc[priority] = (acc[priority] ?? 0) + 1
    return acc
  }, {})

  const totalUnread = threads.reduce((sum, thread) => {
    const customerUnread = thread['unread_count_customer'] ?? 0
    const staffUnread = thread['unread_count_staff'] ?? 0
    return sum + customerUnread + staffUnread
  }, 0)

  const flaggedThreads = threadsWithInsights.filter((thread) => thread.hasFlaggedMessages)
  const escalatedThreads = threadsWithInsights.filter((thread) => {
    const status = normaliseStatus(thread['status'])
    const isClosed = status === 'resolved' || status === 'closed' || status === 'archived'
    return thread.unresolvedReports > 0 || (!isClosed && thread.hasFlaggedMessages)
  })

  return {
    totalThreads: threads.length,
    openThreads: statusCounts['open'] ?? 0,
    inProgressThreads: statusCounts['in_progress'] ?? 0,
    resolvedThreads: statusCounts['resolved'] ?? 0,
    closedThreads: statusCounts['closed'] ?? 0,
    archivedThreads: statusCounts['archived'] ?? 0,
    urgentThreads: priorityCounts['urgent'] ?? 0,
    highPriorityThreads: (priorityCounts['high'] ?? 0) + (priorityCounts['urgent'] ?? 0),
    totalUnread,
    avgFirstResponseMinutes: averageFirstResponse,
    responsesWithinHourRate,
    totalMeasuredResponses: totalResponses,
    flaggedMessages: flaggedMessagesCount,
    flaggedThreads: flaggedThreads.length,
    openEscalations: escalatedThreads.length,
  }
}

export const buildActivitySeries = (activityMap: Map<string, ActivityEntry>): MessageActivityPoint[] => {
  const now = new Date()
  const activity: MessageActivityPoint[] = []
  for (let i = LOOKBACK_DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateKey = date.toISOString().slice(0, 10)
    const entry = activityMap.get(dateKey) ?? { inbound: 0, outbound: 0, responses: [] }
    const avgResponse =
      entry.responses.length > 0 ? entry.responses.reduce((sum, value) => sum + value, 0) / entry.responses.length : null
    activity.push({
      date: dateKey,
      inbound: entry.inbound,
      outbound: entry.outbound,
      avgResponseMinutes: avgResponse,
    })
  }
  return activity
}

export const buildReportSummary = (
  threadsWithInsights: MessageThreadWithInsights[],
  threadMetadataMap: Map<string, Json | null>,
): MessageReportSummary => {
  let totalReports = 0
  let openReports = 0
  let pendingReports = 0

  threadsWithInsights.forEach((thread) => {
    const metadata = threadMetadataMap.get(thread['id'] ?? '') ?? null
    const reportInfo = parseThreadMetadata(metadata)
    totalReports += reportInfo.totalReports
    openReports += reportInfo.openReports
    pendingReports += reportInfo.pendingReports
  })

  const resolvedReports = Math.max(totalReports - openReports, 0)

  return {
    totalReports,
    openReports,
    resolvedReports,
    pendingReports,
  }
}
