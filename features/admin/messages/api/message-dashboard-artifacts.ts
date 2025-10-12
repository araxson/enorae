import { parseModeration } from './moderation'
import { toTimestamp } from './thread-utils'
import type {
  AdminMessageRow,
  MessageRow,
  ModerationQueueItem,
} from './types'

export interface ActivityEntry {
  inbound: number
  outbound: number
  responses: number[]
}

export interface ModerationArtifacts {
  flaggedByThread: Map<string, number>
  moderationQueue: ModerationQueueItem[]
  flaggedMessagesCount: number
  activityMap: Map<string, ActivityEntry>
}

export const ensureActivityEntry = (activityMap: Map<string, ActivityEntry>, dateKey: string): ActivityEntry => {
  const entry = activityMap.get(dateKey) ?? { inbound: 0, outbound: 0, responses: [] }
  if (!activityMap.has(dateKey)) {
    activityMap.set(dateKey, entry)
  }
  return entry
}

export const buildModerationArtifacts = (
  recentMessages: MessageRow[],
  threadMap: Map<string, AdminMessageRow>,
): ModerationArtifacts => {
  const flaggedByThread = new Map<string, number>()
  const moderationQueue: ModerationQueueItem[] = []
  const activityMap = new Map<string, ActivityEntry>()
  let flaggedMessagesCount = 0

  recentMessages.forEach((message) => {
    const thread = message.context_id ? threadMap.get(message.context_id) : undefined
    const moderation = parseModeration(message.metadata)

    if (moderation.isFlagged) {
      flaggedMessagesCount += 1

      if (message.context_id) {
        const current = flaggedByThread.get(message.context_id) ?? 0
        flaggedByThread.set(message.context_id, current + 1)
      }

      if (message.id) {
        moderationQueue.push({
          id: message.id,
          threadId: message.context_id ?? null,
          content: message.content ?? '',
          createdAt: message.created_at ?? new Date().toISOString(),
          reason: moderation.reason,
          severity: moderation.severity,
          status: moderation.status,
          customerName: thread?.customer_name ?? null,
          salonName: thread?.salon_name ?? null,
        })
      }
    }

    if (!thread) return
    const dateKey = message.created_at ? message.created_at.slice(0, 10) : null
    if (!dateKey) return
    const entry = ensureActivityEntry(activityMap, dateKey)

    if (thread.customer_id && message.from_user_id === thread.customer_id) {
      entry.inbound += 1
    } else if (thread.staff_id && message.from_user_id === thread.staff_id) {
      entry.outbound += 1
    }
  })

  moderationQueue.sort((a, b) => (toTimestamp(b.createdAt) ?? 0) - (toTimestamp(a.createdAt) ?? 0))

  return {
    flaggedByThread,
    moderationQueue,
    flaggedMessagesCount,
    activityMap,
  }
}
