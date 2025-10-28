import type { AdminMessageRow, MessageRow } from './types'
import { toTimestamp } from './thread-utils'

export const buildThreadMap = (threads: AdminMessageRow[]): Map<string, AdminMessageRow> => {
  const map = new Map<string, AdminMessageRow>()
  threads.forEach((thread) => {
    if (thread['id']) {
      map.set(thread['id'], thread)
    }
  })
  return map
}

export const groupMessagesByThread = (
  recentMessages: MessageRow[],
  threadMap: Map<string, AdminMessageRow>,
): Map<string, MessageRow[]> => {
  const messagesByThread = new Map<string, MessageRow[]>()
  recentMessages.forEach((message) => {
    if (!message['context_id']) return
    if (!threadMap.has(message['context_id'])) return
    const collection = messagesByThread.get(message['context_id']) ?? []
    collection.push(message)
    messagesByThread.set(message['context_id'], collection)
  })

  messagesByThread.forEach((messages) => {
    messages.sort((a, b) => (toTimestamp(a['created_at']) ?? 0) - (toTimestamp(b['created_at']) ?? 0))
  })

  return messagesByThread
}
