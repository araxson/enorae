'use server'

import { requireAuth } from '@/lib/auth/guards'
import { requireStaffId } from '@/features/shared/staff/utils'
import {
  createMessage,
  getThread,
  revalidateMessagePaths,
} from '@/features/shared/messaging/api/operations'
import { threadMessageSchema } from '@/features/staff/messages/api/schema'
import { sanitizeText, isSpamContent } from '@/lib/utils/sanitize'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type ActionState = {
  success: boolean
  message: string
  errors: Record<string, string[]>
}

export async function sendThreadMessageAction(
  threadId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { user, supabase } = await requireAuth()

    // SECURITY: Rate limiting - 10 messages per minute per user
    const clientIp = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('staff-thread-message-action', `${user.id}:${clientIp}`)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 10,
      windowMs: 60000, // 1 minute
    })

    if (!rateLimitResult.success) {
      return {
        success: false,
        message: rateLimitResult.error ?? 'Too many messages sent. Please try again later.',
        errors: {},
      }
    }

    // Parse form data
    const parsed = threadMessageSchema.safeParse({
      content: formData.get('content'),
    })

    if (!parsed.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    // SECURITY: Sanitize message content to prevent XSS
    const sanitizedContent = sanitizeText(parsed.data.content)

    // SECURITY: Check for spam content
    if (isSpamContent(sanitizedContent)) {
      return {
        success: false,
        message: 'Message appears to contain spam or promotional content',
        errors: {},
      }
    }

    const staffId = await requireStaffId(supabase, user.id)

    // Get thread details to find recipient
    const thread = await getThread(supabase, threadId)
    if (!thread) {
      return {
        success: false,
        message: 'Thread not found',
        errors: {},
      }
    }

    if (thread.staff_id !== staffId) {
      return {
        success: false,
        message: 'You do not have permission to send messages in this thread',
        errors: {},
      }
    }

    if (!thread.customer_id) {
      return {
        success: false,
        message: 'Invalid thread configuration. Please contact support.',
        errors: {},
      }
    }

    const result = await createMessage(supabase, {
      from_user_id: user.id,
      to_user_id: thread.customer_id,
      content: sanitizedContent,
      context_type: 'general',
    })

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to send message',
        errors: {},
      }
    }

    revalidateMessagePaths('staff', threadId)

    return {
      success: true,
      message: 'Message sent successfully',
      errors: {},
    }
  } catch (error) {
    console.error('Error sending thread message:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: {},
    }
  }
}
