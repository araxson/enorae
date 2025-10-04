import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// FIXED: Use admin_messages_overview view
type AdminMessage = Database['public']['Views']['admin_messages_overview']['Row']

export type MessageSummary = {
  totalThreads: number
  totalMessages: number
  activeThreadsToday: number
  avgMessagesPerThread: number
  mostActiveUsers: number
}

export type ThreadActivity = {
  threadId: string
  salonName: string | null
  participantCount: number
  messageCount: number
  lastMessageAt: string | null
  lastMessagePreview: string | null
}

export type UserActivity = {
  userId: string
  userName: string | null
  userEmail: string | null
  threadCount: number
  messageCount: number
  lastActiveAt: string | null
}

export type SalonMessageStats = {
  salonId: string
  salonName: string
  totalThreads: number
  totalMessages: number
  avgResponseTime: number | null
}

/**
 * Get platform-wide message summary
 */
export async function getMessageSummary(): Promise<MessageSummary> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // Get total threads
  const { count: totalThreads } = await supabase
    .from('message_threads')
    .select('*', { count: 'exact', head: true })

  // Get total messages
  const { count: totalMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })

  // Get threads active today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: activeThreadsToday } = await supabase
    .from('message_threads')
    .select('*', { count: 'exact', head: true })
    .gte('updated_at', today.toISOString())

  // Get unique users who sent messages
  const { data: senders } = await supabase
    .from('messages')
    .select('from_user_id')

  const uniqueUsers = new Set((senders || []).map((m: { from_user_id: string | null }) => m.from_user_id))

  return {
    totalThreads: totalThreads || 0,
    totalMessages: totalMessages || 0,
    activeThreadsToday: activeThreadsToday || 0,
    avgMessagesPerThread:
      totalThreads && totalMessages ? Math.round((totalMessages / totalThreads) * 10) / 10 : 0,
    mostActiveUsers: uniqueUsers.size,
  }
}

/**
 * Get most active message threads
 * IMPROVED: Uses admin_messages_overview view (eliminates N×4 pattern)
 */
export async function getActiveThreads(limit = 20): Promise<ThreadActivity[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view with all thread data pre-joined
  const { data, error } = await supabase
    .from('admin_messages_overview')
    .select('*')
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw error
  if (!data) return []

  const threads = data as AdminMessage[]

  // Get all thread IDs for batch message queries
  const threadIds = threads.map(t => t.id)

  // ✅ FIXED: Single query for message counts (instead of N queries)
  // TODO: Fix query - messages table uses context_id, not thread_id
  const { data: messageCounts } = await supabase
    .from('messages')
    .select('context_id')
    .in('context_id', threadIds)

  // Count messages per thread
  const messageCountMap = new Map<string, number>()
  const participantMap = new Map<string, Set<string>>()

  if (messageCounts) {
    for (const msg of messageCounts as Array<{ context_id: string }>) {
      messageCountMap.set(
        msg.context_id,
        (messageCountMap.get(msg.context_id) || 0) + 1
      )
    }
  }

  // ✅ FIXED: Single query for all last messages (instead of N queries)
  // TODO: Fix query - messages table uses context_id, not thread_id
  const { data: messages } = await supabase
    .from('messages')
    .select('context_id, content, created_at, from_user_id, to_user_id')
    .in('context_id', threadIds)
    .order('created_at', { ascending: false })

  // Get last message per thread and count participants
  const lastMessageMap = new Map<string, { content: string; created_at: string }>()

  if (messages) {
    for (const msg of messages as Array<{
      context_id: string
      content: string
      created_at: string
      from_user_id: string
      to_user_id: string
    }>) {
      // Track last message
      if (!lastMessageMap.has(msg.context_id)) {
        lastMessageMap.set(msg.context_id, {
          content: msg.content,
          created_at: msg.created_at,
        })
      }

      // Track participants
      if (!participantMap.has(msg.context_id)) {
        participantMap.set(msg.context_id, new Set())
      }
      participantMap.get(msg.context_id)!.add(msg.from_user_id)
      participantMap.get(msg.context_id)!.add(msg.to_user_id)
    }
  }

  // Map to thread activities (all data from view!)
  const threadActivities: ThreadActivity[] = threads
    .filter(thread => thread.id !== null)
    .map(thread => {
      const messageCount = messageCountMap.get(thread.id!) || 0
      const participantCount = participantMap.get(thread.id!)?.size || 2 // Default: customer + staff
      const lastMessage = lastMessageMap.get(thread.id!)

      return {
        threadId: thread.id!,
        salonName: thread.salon_name || 'Unknown',
        participantCount,
        messageCount,
        lastMessageAt: lastMessage?.created_at || thread.last_message_at || new Date().toISOString(),
        lastMessagePreview: lastMessage?.content
          ? lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '')
          : 'No messages',
      }
    })

  return threadActivities
}

/**
 * Get most active users by message count
 */
export async function getActiveUsers(limit = 20): Promise<UserActivity[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('from_user_id, created_at')

  if (!messages) return []

  // Group by sender
  const userMap = new Map<string, { messageCount: number; lastActiveAt: string }>()

  for (const msg of messages as Array<{ from_user_id: string; created_at: string }>) {
    if (!userMap.has(msg.from_user_id)) {
      userMap.set(msg.from_user_id, { messageCount: 0, lastActiveAt: msg.created_at })
    }
    const entry = userMap.get(msg.from_user_id)!
    entry.messageCount++
    if (msg.created_at > entry.lastActiveAt) {
      entry.lastActiveAt = msg.created_at
    }
  }

  // Get thread counts from message_threads (customer_id and staff_id)
  const { data: threads } = await supabase
    .from('message_threads')
    .select('customer_id, staff_id')

  const threadCounts = new Map<string, Set<string>>()
  if (threads) {
    for (const thread of threads as Array<{ customer_id: string; staff_id: string | null; id: string }>) {
      if (!threadCounts.has(thread.customer_id)) {
        threadCounts.set(thread.customer_id, new Set())
      }
      threadCounts.get(thread.customer_id)!.add(thread.id)

      if (thread.staff_id) {
        if (!threadCounts.has(thread.staff_id)) {
          threadCounts.set(thread.staff_id, new Set())
        }
        threadCounts.get(thread.staff_id)!.add(thread.id)
      }
    }
  }

  const userActivities: UserActivity[] = []

  for (const [userId, data] of userMap.entries()) {
    // Try to get user details from auth.users through supabase admin
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users?.find(u => u.id === userId)

    userActivities.push({
      userId,
      userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || null,
      userEmail: user?.email || null,
      threadCount: threadCounts.get(userId)?.size || 0,
      messageCount: data.messageCount,
      lastActiveAt: data.lastActiveAt,
    })
  }

  return userActivities.sort((a, b) => b.messageCount - a.messageCount).slice(0, limit)
}

/**
 * Get message statistics by salon
 * IMPROVED: Uses admin_messages_overview (eliminates N×(2+M) pattern)
 */
export async function getSalonMessageStats(): Promise<SalonMessageStats[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // ✅ FIXED: Single query to view with all thread data grouped by salon
  const { data, error } = await supabase
    .from('admin_messages_overview')
    .select('salon_id, salon_name, id')
    .not('salon_id', 'is', null)

  if (error) throw error
  if (!data) return []

  const threads = data as AdminMessage[]

  // Group threads by salon
  const salonThreadMap = new Map<string, { name: string; threadIds: string[] }>()

  threads.forEach(thread => {
    if (!thread.salon_id || !thread.id) return

    if (!salonThreadMap.has(thread.salon_id)) {
      salonThreadMap.set(thread.salon_id, {
        name: thread.salon_name || 'Unknown',
        threadIds: [],
      })
    }
    salonThreadMap.get(thread.salon_id)!.threadIds.push(thread.id)
  })

  // ✅ FIXED: Single query for all message counts (instead of N×M queries)
  // TODO: Fix query - messages table uses context_id, not thread_id
  const { data: messageCounts } = await supabase
    .from('messages')
    .select('context_id')

  // Count messages per thread
  const messageCountMap = new Map<string, number>()
  if (messageCounts) {
    for (const msg of messageCounts as Array<{ context_id: string }>) {
      messageCountMap.set(
        msg.context_id,
        (messageCountMap.get(msg.context_id) || 0) + 1
      )
    }
  }

  // Aggregate per salon
  const salonStats: SalonMessageStats[] = Array.from(salonThreadMap.entries()).map(
    ([salonId, data]) => {
      const totalMessages = data.threadIds.reduce(
        (sum, threadId) => sum + (messageCountMap.get(threadId) || 0),
        0
      )

      return {
        salonId,
        salonName: data.name,
        totalThreads: data.threadIds.length,
        totalMessages,
        avgResponseTime: null, // Would need timestamp analysis
      }
    }
  )

  return salonStats.sort((a, b) => b.totalMessages - a.totalMessages)
}
