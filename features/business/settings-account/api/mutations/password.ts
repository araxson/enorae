'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger, logError } from '@/lib/observability'

/**
 * Request reauthentication nonce for password change
 * SECURITY: Nonce prevents session hijacking attacks
 */
export async function requestPasswordChangeNonce() {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase.auth.reauthenticate()

    if (error) {
      return { success: false, message: 'Failed to request reauthentication. Please try again.' }
    }

    return { success: true, message: 'Verification code sent to your email' }
  } catch (error) {
    return { success: false, message: 'Failed to request reauthentication. Please try again.' }
  }
}

/**
 * Update user password - Server Action
 * SECURITY: Requires current password verification AND reauthentication nonce
 * @see Pattern 29 in docs/rules/09-auth.md
 */
export async function updatePasswordAction(prevState: unknown, formData: FormData) {
  try {
    const session = await requireAuth()
    const logger = createOperationLogger('updatePassword', { userId: session.user.id })
    logger.start()

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const nonce = formData.get('nonce') as string

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: 'All fields are required',
        errors: {
          currentPassword: !currentPassword ? ['Current password is required'] : undefined,
          newPassword: !newPassword ? ['New password is required'] : undefined,
          confirmPassword: !confirmPassword ? ['Please confirm your password'] : undefined,
        },
      }
    }

    // SECURITY: Nonce is required for password changes to prevent session hijacking
    if (!nonce) {
      return {
        success: false,
        message: 'Verification code required. Please request a new code.',
        errors: {
          nonce: ['Verification code is required for password changes'],
        },
      }
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'New password must be at least 8 characters',
        errors: {
          newPassword: ['Password must be at least 8 characters'],
        },
      }
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'New passwords do not match',
        errors: {
          confirmPassword: ['Passwords do not match'],
        },
      }
    }

    const supabase = await createClient()

    // Verify current password by re-authenticating
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword,
    })

    if (signInError) {
      logError('Password verification failed during password update', {
        operationName: 'updatePassword',
        userId: session.user.id,
        error: 'Current password incorrect',
        errorCategory: 'auth',
      })
      logger.error('Current password incorrect', 'auth', { userId: session.user.id })
      return {
        success: false,
        message: 'Current password is incorrect',
        errors: {
          currentPassword: ['Current password is incorrect'],
        },
      }
    }

    // SECURITY: Update to new password WITH nonce to prevent session hijacking
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      nonce, // CRITICAL: Always include nonce for password changes
    })

    if (updateError) {
      logger.error(updateError, 'auth', { userId: session.user.id })
      // SECURITY: Check for nonce-specific errors
      if (updateError.message?.includes('nonce')) {
        return {
          success: false,
          message: 'Invalid or expired verification code. Please request a new one.',
          errors: {
            nonce: ['Invalid or expired verification code'],
          },
        }
      }
      return {
        success: false,
        message: updateError.message || 'Failed to update password',
      }
    }

    logger.success({ userId: session.user.id })

    return {
      success: true,
      message: 'Password updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update password',
    }
  }
}

/**
 * Update user password with reauthentication nonce
 * SECURITY: Requires nonce from email to prevent session hijacking
 * @deprecated Use updatePasswordAction for form submissions
 */
export async function updatePassword(currentPassword: string, newPassword: string, nonce?: string) {
  const session = await requireAuth()
  const logger = createOperationLogger('updatePassword', { userId: session.user.id })
  logger.start()

  const supabase = await createClient()

  // Verify current password by re-authenticating
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email!,
    password: currentPassword,
  })

  if (signInError) {
    logError('Password verification failed during password update', {
      operationName: 'updatePassword',
      userId: session.user.id,
      error: 'Current password incorrect',
      errorCategory: 'auth',
    })
    logger.error('Current password incorrect', 'auth', { userId: session.user.id })
    return { success: false, message: 'Current password is incorrect' }
  }

  // SECURITY: Update to new password with nonce for extra protection
  // If nonce is provided, it must be valid (sent to user's email)
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
    ...(nonce && { nonce }), // Include nonce if provided
  })

  if (updateError) {
    logger.error(updateError, 'auth', { userId: session.user.id })
    if (updateError.message?.includes('nonce')) {
      return { success: false, message: 'Invalid or expired verification code. Please request a new one.' }
    }
    return { success: false, message: updateError.message || 'Failed to update password' }
  }

  logger.success({ userId: session.user.id })

  return { success: true }
}
