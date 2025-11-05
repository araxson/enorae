'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

/**
 * Update user email
 * SECURITY: Email change sends verification link to new email address
 * User must click link to confirm ownership of new email
 * For enhanced security, optionally provide nonce from reauthentication
 */
export async function updateEmail(newEmail: string, nonce?: string) {
  const session = await requireAuth()
  const logger = createOperationLogger('updateEmail', {
    userId: session.user.id,
    newEmail,
  })
  logger.start()

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
    ...(nonce && { nonce }), // Optional nonce for enhanced security
  })

  if (error) {
    logger.error(error, 'auth', { userId: session.user.id, newEmail })
    if (error.message?.includes('nonce')) {
      throw new Error('Invalid or expired verification code. Please request a new one.')
    }
    throw error
  }

  logger.success({ userId: session.user.id, newEmail })

  return { success: true, message: 'Verification email sent to new address' }
}
