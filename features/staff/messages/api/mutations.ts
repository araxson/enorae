'use server'
import { requireAuth } from '@/lib/auth/guards'
import { requireStaffId } from '@/features/shared/staff/utils'
import { createMessage, getThread, archiveThread as archiveThreadOp, markMessagesAsRead, revalidateMessagePaths } from '@/features/shared/messaging/api/operations'
import {
  messageSchema,
  threadMessageSchema,
  type MessageFormData,
  type ThreadMessageFormData,
} from '@/features/staff/messages/api/schema'
import { sanitizeText, isSpamContent } from '@/lib/utils/sanitize'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function sendMessage(data: MessageFormData): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth()

    // SECURITY: Rate limiting - 10 messages per minute per user
    const clientIp = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('staff-message', `${user.id}:${clientIp}`)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 10,
      windowMs: 60000, // 1 minute
    })

    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error ?? 'Too many messages sent. Please try again later.' }
    }

    // SECURITY: Use safeParse to avoid throwing errors in Server Actions
    const validation = messageSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
      }
    }
    const validated = validation.data

    // SECURITY: Sanitize message content to prevent XSS
    const sanitizedContent = sanitizeText(validated.content)

    // SECURITY: Check for spam content
    if (isSpamContent(sanitizedContent)) {
      return { success: false, error: 'Message appears to contain spam or promotional content' }
    }

    const result = await createMessage(supabase, {
      from_user_id: user.id,
      to_user_id: validated.to_user_id,
      content: sanitizedContent,
      context_type: validated.context_type,
      context_id: validated.context_id,
    })

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to send message' }
    }

    revalidateMessagePaths('staff')
    return { success: true }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function sendThreadMessage(threadId: string, data: ThreadMessageFormData): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth()

    // SECURITY: Rate limiting - 10 messages per minute per user
    const clientIp = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('staff-thread-message', `${user.id}:${clientIp}`)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 10,
      windowMs: 60000, // 1 minute
    })

    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error ?? 'Too many messages sent. Please try again later.' }
    }

    // SECURITY: Use safeParse to avoid throwing errors in Server Actions
    const validation = threadMessageSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
      }
    }
    const validated = validation.data

    const staffId = await requireStaffId(supabase, user.id)

    // Get thread details to find recipient
    const thread = await getThread(supabase, threadId)
    if (!thread) {
      return { success: false, error: 'Thread not found' }
    }

    if (thread.staff_id !== staffId) {
      return { success: false, error: 'You do not have permission to send messages in this thread' }
    }

    if (!thread.customer_id) {
      return { success: false, error: 'Invalid thread configuration. Please contact support.' }
    }

    // SECURITY: Sanitize message content to prevent XSS
    const sanitizedContent = sanitizeText(validated.content)

    // SECURITY: Check for spam content
    if (isSpamContent(sanitizedContent)) {
      return { success: false, error: 'Message appears to contain spam or promotional content' }
    }

    const result = await createMessage(supabase, {
      from_user_id: user.id,
      to_user_id: thread.customer_id,
      content: sanitizedContent,
      context_type: 'general',
    })

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to send message' }
    }

    revalidateMessagePaths('staff', threadId)
    return { success: true }
  } catch (error) {
    console.error('Error sending thread message:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function markThreadAsRead(threadId: string): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth()
    const staffId = await requireStaffId(supabase, user.id)

    // Verify thread access
    const thread = await getThread(supabase, threadId)
    if (!thread || thread.staff_id !== staffId) {
      return { success: false, error: 'You do not have permission to access this thread' }
    }

    // Mark all messages in thread as read
    const result = await markMessagesAsRead(supabase, user.id, threadId)
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to mark messages as read' }
    }

    revalidateMessagePaths('staff', threadId)
    return { success: true }
  } catch (error) {
    console.error('Error marking thread as read:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function archiveThread(threadId: string): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth()
    const staffId = await requireStaffId(supabase, user.id)

    // Verify thread access
    const thread = await getThread(supabase, threadId)
    if (!thread || thread.staff_id !== staffId) {
      return { success: false, error: 'You do not have permission to access this thread' }
    }

    const result = await archiveThreadOp(supabase, threadId)
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to archive thread' }
    }

    revalidateMessagePaths('staff')
    return { success: true }
  } catch (error) {
    console.error('Error archiving thread:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
