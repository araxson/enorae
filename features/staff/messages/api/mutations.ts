'use server'
import { requireAuth } from '@/lib/auth/guards'
import { requireStaffId } from '@/features/shared/staff/utils/staff-helpers'
import { createMessage, getThread, archiveThread as archiveThreadOp, markMessagesAsRead, revalidateMessagePaths } from '@/features/shared/messaging/api/operations'
import {
  messageSchema,
  threadMessageSchema,
  type MessageFormData,
  type ThreadMessageFormData,
} from '@/features/staff/messages/api/schema'

export async function sendMessage(data: MessageFormData) {
  const { user, supabase } = await requireAuth()
  const validated = messageSchema.parse(data)

  const result = await createMessage(supabase, {
    from_user_id: user.id,
    to_user_id: validated.to_user_id,
    content: validated.content,
    context_type: validated.context_type,
    context_id: validated.context_id,
  })

  if (!result.success) throw new Error(result.error)

  revalidateMessagePaths('staff')
}

export async function sendThreadMessage(threadId: string, data: ThreadMessageFormData) {
  const { user, supabase } = await requireAuth()
  const validated = threadMessageSchema.parse(data)

  const staffId = await requireStaffId(supabase, user.id)

  // Get thread details to find recipient
  const thread = await getThread(supabase, threadId)
  if (!thread) throw new Error('Thread not found')

  if (thread.staff_id !== staffId) {
    throw new Error('Unauthorized to send message in this thread')
  }

  if (!thread.customer_id) throw new Error('Invalid thread configuration')

  const result = await createMessage(supabase, {
    from_user_id: user.id,
    to_user_id: thread.customer_id,
    content: validated.content,
    context_type: 'general',
  })

  if (!result.success) throw new Error(result.error)

  revalidateMessagePaths('staff', threadId)
}

export async function markThreadAsRead(threadId: string) {
  const { user, supabase } = await requireAuth()
  const staffId = await requireStaffId(supabase, user.id)

  // Verify thread access
  const thread = await getThread(supabase, threadId)
  if (!thread || thread.staff_id !== staffId) {
    throw new Error('Unauthorized to access this thread')
  }

  // Mark all messages in thread as read
  const result = await markMessagesAsRead(supabase, user.id, threadId)
  if (!result.success) throw new Error(result.error)

  revalidateMessagePaths('staff', threadId)
}

export async function archiveThread(threadId: string) {
  const { user, supabase } = await requireAuth()
  const staffId = await requireStaffId(supabase, user.id)

  // Verify thread access
  const thread = await getThread(supabase, threadId)
  if (!thread || thread.staff_id !== staffId) {
    throw new Error('Unauthorized to access this thread')
  }

  const result = await archiveThreadOp(supabase, threadId)
  if (!result.success) throw new Error(result.error)

  revalidateMessagePaths('staff')
}
