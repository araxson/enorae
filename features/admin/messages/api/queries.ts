import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database, Json } from '@/lib/types/database.types'

type AdminMessageRow = Database['public']['Views']['admin_messages_overview']['Row']
type MessageThreadRow = Database['communication']['Tables']['message_threads']['Row']
type MessageRow = Database['communication']['Tables']['messages']['Row']

type ThreadStatus = Database['public']['Enums']['thread_status']
type ThreadPriority = Database['public']['Enums']['thread_priority']

export type MessageThreadWithInsights = AdminMessageRow & {
  hasFlaggedMessages: boolean
  flaggedMessageCount: number
  unresolvedReports: number
  firstResponseMinutes: number | null
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

const LOOKBACK_DAYS = 30
const SPAM_THRESHOLD = 0.9
const TOXICITY_THRESHOLD = 0.85

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

interface ParsedModeration {
  isFlagged: boolean
  reason: string
  severity: 'low' | 'medium' | 'high'
  status: string
}

const parseModeration = (metadata: Json | null): ParsedModeration => {
  if (!isObject(metadata)) {
    return { isFlagged: false, reason: '', severity: 'low', status: 'clean' }
  }

  const moderation = isObject(metadata.moderation) ? (metadata.moderation as Record<string, unknown>) : undefined
  const spamScore = typeof metadata.spam_score === 'number'
    ? metadata.spam_score
    : typeof moderation?.spam_score === 'number'
      ? (moderation.spam_score as number)
      : null
  const toxicityScore = typeof metadata.toxicity_score === 'number'
    ? metadata.toxicity_score
    : typeof moderation?.toxicity === 'number'
      ? (moderation.toxicity as number)
      : null
  const flaggedCategories = Array.isArray(moderation?.categories)
    ? (moderation!.categories as unknown[]).filter((item) => typeof item === 'string')
    : undefined

  const baseReason =
    (typeof metadata.flagged_reason === 'string' ? metadata.flagged_reason : undefined) ??
    (typeof moderation?.reason === 'string' ? moderation.reason : undefined) ??
    (typeof moderation?.label === 'string' ? moderation.label : undefined) ??
    (flaggedCategories && flaggedCategories.length > 0 ? flaggedCategories.join(', ') : undefined)

  const flaggedExplicit =
    metadata.is_flagged === true ||
    metadata.flagged === true ||
    moderation?.flagged === true

  const spamFlagged = typeof spamScore === 'number' && spamScore >= SPAM_THRESHOLD
  const toxicityFlagged = typeof toxicityScore === 'number' && toxicityScore >= TOXICITY_THRESHOLD
  const categoryFlagged = Boolean(
    flaggedCategories &&
      flaggedCategories.some((category) => {
        const value = category.toLowerCase()
        return value.includes('abuse') || value.includes('harassment') || value.includes('spam')
      }),
  )

  const isFlagged = Boolean(flaggedExplicit || spamFlagged || toxicityFlagged || categoryFlagged)

  let severity: ParsedModeration['severity'] = 'low'
  if (typeof toxicityScore === 'number' && toxicityScore >= 0.92) {
    severity = 'high'
  } else if (typeof spamScore === 'number' && spamScore >= 0.95) {
    severity = 'high'
  } else if (toxicityFlagged || spamFlagged || categoryFlagged) {
    severity = 'medium'
  }

  const status =
    typeof moderation?.status === 'string'
      ? moderation.status
      : isFlagged
        ? 'pending_review'
        : 'clean'

  return {
    isFlagged,
    reason: baseReason ?? (spamFlagged ? 'Spam indicators' : toxicityFlagged ? 'Toxicity indicators' : 'Flagged content'),
    severity,
    status,
  }
}

interface ParsedThreadMetadata {
  totalReports: number
  openReports: number
  pendingReports: number
}

const parseThreadMetadata = (metadata: Json | null): ParsedThreadMetadata => {
  if (!isObject(metadata)) {
    return { totalReports: 0, openReports: 0, pendingReports: 0 }
  }

  const reports = Array.isArray(metadata.reports)
    ? (metadata.reports as unknown[]).filter(isObject)
    : []

  const totalReports = reports.length
  const openReports = reports.filter((report) => {
    const status = typeof report.status === 'string' ? report.status.toLowerCase() : 'open'
    return !['resolved', 'closed', 'dismissed'].includes(status)
  }).length

  const moderationStatus = (() => {
    if (typeof metadata.moderation_status === 'string') return metadata.moderation_status
    if (isObject(metadata.moderation) && typeof metadata.moderation.status === 'string') {
      return metadata.moderation.status
    }
    return null
  })()

  const pendingReports = moderationStatus && moderationStatus !== 'resolved' ? 1 : 0

  return {
    totalReports,
    openReports,
    pendingReports,
  }
}

interface FirstResponseResult {
  minutes: number | null
  firstCustomerMessageAt: string | null
}

const computeFirstResponse = (
  thread: AdminMessageRow,
  messages: MessageRow[],
): FirstResponseResult => {
  const customerId = thread.customer_id
  const staffId = thread.staff_id
  if (!customerId || !staffId || !messages.length) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const customerMessages = messages.filter((message) => message.from_user_id === customerId)
  if (!customerMessages.length) {
    return { minutes: null, firstCustomerMessageAt: null }
  }

  const firstCustomerMessage = customerMessages[0]
  const staffResponse = messages.find(
    (message) =>
      message.from_user_id === staffId &&
      new Date(message.created_at).getTime() > new Date(firstCustomerMessage.created_at).getTime(),
  )

  if (!staffResponse) {
    return { minutes: null, firstCustomerMessageAt: firstCustomerMessage.created_at }
  }

  const diffMinutes =
    (new Date(staffResponse.created_at).getTime() - new Date(firstCustomerMessage.created_at).getTime()) /
    (60 * 1000)

  return {
    minutes: diffMinutes,
    firstCustomerMessageAt: firstCustomerMessage.created_at,
  }
}

const normaliseStatus = (status: string | null | undefined): ThreadStatus | null => {
  if (!status) return null
  const normalised = status.toLowerCase() as ThreadStatus
  return normalised
}

const normalisePriority = (priority: string | null | undefined): ThreadPriority | null => {
  if (!priority) return null
  return priority.toLowerCase() as ThreadPriority
}

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
      .schema('communication')
      .from('message_threads')
      .select('id, metadata')
      .in('id', threadIds)

    if (!threadMetaError && threadMetaRows) {
      threadMetadataMap = new Map(
        (threadMetaRows as Pick<MessageThreadRow, 'id' | 'metadata'>[]).map((row) => [row.id, row.metadata]),
      )
    }
  }

  const lookbackStart = new Date()
  lookbackStart.setDate(lookbackStart.getDate() - (LOOKBACK_DAYS - 1))
  lookbackStart.setHours(0, 0, 0, 0)

  let recentMessages: MessageRow[] = []
  if (threadIds.length) {
    const { data: messagesData, error: messagesError } = await supabase
      .schema('communication')
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

  const threadMap = new Map<string, AdminMessageRow>()
  threads.forEach((thread) => {
    if (thread.id) {
      threadMap.set(thread.id, thread)
    }
  })

  const messagesByThread = new Map<string, MessageRow[]>()
  recentMessages.forEach((message) => {
    if (!message.context_id || !threadMap.has(message.context_id)) return
    const collection = messagesByThread.get(message.context_id) ?? []
    collection.push(message)
    messagesByThread.set(message.context_id, collection)
  })

  messagesByThread.forEach((messages) => {
    messages.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
  })

  const flaggedByThread = new Map<string, number>()
  const moderationQueue: ModerationQueueItem[] = []
  let flaggedMessagesCount = 0

  recentMessages.forEach((message) => {
    const moderation = parseModeration(message.metadata)

    if (moderation.isFlagged) {
      flaggedMessagesCount += 1

      if (message.context_id) {
        const current = flaggedByThread.get(message.context_id) ?? 0
        flaggedByThread.set(message.context_id, current + 1)
      }

      const thread = message.context_id ? threadMap.get(message.context_id) : undefined

      moderationQueue.push({
        id: message.id,
        threadId: message.context_id ?? null,
        content: message.content,
        createdAt: message.created_at,
        reason: moderation.reason,
        severity: moderation.severity,
        status: moderation.status,
        customerName: thread?.customer_name ?? null,
        salonName: thread?.salon_name ?? null,
      })
    }
  })

  moderationQueue.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const activityMap = new Map<string, { inbound: number; outbound: number; responses: number[] }>()
  const generateActivityEntry = (dateKey: string) => {
    const entry = activityMap.get(dateKey) ?? { inbound: 0, outbound: 0, responses: [] }
    activityMap.set(dateKey, entry)
    return entry
  }

  recentMessages.forEach((message) => {
    if (!message.context_id) return
    const thread = threadMap.get(message.context_id)
    if (!thread) return

    const dateKey = message.created_at.slice(0, 10)
    const entry = generateActivityEntry(dateKey)

    if (thread.customer_id && message.from_user_id === thread.customer_id) {
      entry.inbound += 1
    } else if (thread.staff_id && message.from_user_id === thread.staff_id) {
      entry.outbound += 1
    }
  })

  const firstResponseDurations: number[] = []
  let responsesWithinHour = 0

  const threadsWithInsights: MessageThreadWithInsights[] = threads.map((thread) => {
    const threadId = thread.id ?? ''
    const flaggedCount = flaggedByThread.get(threadId) ?? 0
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
        const entry = generateActivityEntry(responseDay)
        entry.responses.push(firstResponse.minutes)
      }
    }

    return {
      ...thread,
      hasFlaggedMessages: flaggedCount > 0,
      flaggedMessageCount: flaggedCount,
      unresolvedReports: reportInfo.openReports + reportInfo.pendingReports,
      firstResponseMinutes: firstResponse.minutes,
    }
  })

  const totalResponses = firstResponseDurations.length
  const averageFirstResponse =
    totalResponses > 0
      ? firstResponseDurations.reduce((sum, value) => sum + value, 0) / totalResponses
      : null

  const responsesWithinHourRate =
    totalResponses > 0 ? responsesWithinHour / totalResponses : null

  const statusCounts = threads.reduce<Record<string, number>>((acc, thread) => {
    const status = normaliseStatus(thread.status)?.toString() ?? 'open'
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  const priorityCounts = threads.reduce<Record<string, number>>((acc, thread) => {
    const priority = normalisePriority(thread.priority)?.toString() ?? 'normal'
    acc[priority] = (acc[priority] ?? 0) + 1
    return acc
  }, {})

  const totalUnread = threads.reduce((sum, thread) => {
    const customerUnread = thread.unread_count_customer ?? 0
    const staffUnread = thread.unread_count_staff ?? 0
    return sum + customerUnread + staffUnread
  }, 0)

  const flaggedThreads = threadsWithInsights.filter((thread) => thread.hasFlaggedMessages)
  const escalatedThreads = threadsWithInsights.filter((thread) => {
    const status = normaliseStatus(thread.status)
    const isClosed = status === 'resolved' || status === 'closed' || status === 'archived'
    return thread.unresolvedReports > 0 || (!isClosed && thread.hasFlaggedMessages)
  })

  const stats: MessageStats = {
    totalThreads: threads.length,
    openThreads: statusCounts.open ?? 0,
    inProgressThreads: statusCounts.in_progress ?? 0,
    resolvedThreads: statusCounts.resolved ?? 0,
    closedThreads: statusCounts.closed ?? 0,
    archivedThreads: statusCounts.archived ?? 0,
    urgentThreads: (priorityCounts.urgent ?? 0),
    highPriorityThreads: (priorityCounts.high ?? 0) + (priorityCounts.urgent ?? 0),
    totalUnread,
    avgFirstResponseMinutes: averageFirstResponse,
    responsesWithinHourRate,
    totalMeasuredResponses: totalResponses,
    flaggedMessages: flaggedMessagesCount,
    flaggedThreads: flaggedThreads.length,
    openEscalations: escalatedThreads.length,
  }

  const now = new Date()
  const activity: MessageActivityPoint[] = []
  for (let i = LOOKBACK_DAYS - 1; i >= 0; i -= 1) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateKey = date.toISOString().slice(0, 10)
    const entry = activityMap.get(dateKey) ?? { inbound: 0, outbound: 0, responses: [] }
    const avgResponse =
      entry.responses.length > 0
        ? entry.responses.reduce((sum, value) => sum + value, 0) / entry.responses.length
        : null
    activity.push({
      date: dateKey,
      inbound: entry.inbound,
      outbound: entry.outbound,
      avgResponseMinutes: avgResponse,
    })
  }

  let totalReports = 0
  let openReports = 0
  let pendingReports = 0

  threadsWithInsights.forEach((thread) => {
    const metadata = threadMetadataMap.get(thread.id ?? '') ?? null
    const reportInfo = parseThreadMetadata(metadata)
    totalReports += reportInfo.totalReports
    openReports += reportInfo.openReports
    pendingReports += reportInfo.pendingReports
  })

  const resolvedReports = Math.max(totalReports - openReports, 0)
  const reportSummary: MessageReportSummary = {
    totalReports,
    openReports,
    resolvedReports,
    pendingReports,
  }

  const moderationQueueLimited = moderationQueue.slice(0, 50)

  return {
    threads: threadsWithInsights,
    stats,
    moderationQueue: moderationQueueLimited,
    activity,
    reportSummary,
  }
}
