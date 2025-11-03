'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger, logError } from '@/lib/observability'

/**
 * Update user password
 */
export async function updatePassword(currentPassword: string, newPassword: string) {
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
    throw new Error('Current password is incorrect')
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    logger.error(updateError, 'auth', { userId: session.user.id })
    throw updateError
  }

  logger.success({ userId: session.user.id })

  return { success: true }
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string) {
  const session = await requireAuth()
  const logger = createOperationLogger('updateEmail', {
    userId: session.user.id,
    newEmail,
  })
  logger.start()

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (error) {
    logger.error(error, 'auth', { userId: session.user.id, newEmail })
    throw error
  }

  logger.success({ userId: session.user.id, newEmail })

  return { success: true, message: 'Verification email sent to new address' }
}

/**
 * Update profile information
 */
export async function updateProfile(data: {
  full_name?: string
  phone?: string
  avatar_url?: string
}) {
  const session = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .update({
      full_name: data.full_name,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', session.user.id)

  if (error) throw error

  // Update phone in profiles_preferences if provided
  if (data.phone !== undefined) {
    await supabase
      .schema('identity')
      .from('profiles_preferences')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', session.user.id)
  }

  revalidatePath('/business/settings/account', 'page')
  return { success: true }
}

/**
 * Enable/disable two-factor authentication
 */
export async function updateTwoFactorAuth(enabled: boolean) {
  await requireAuth()
  const supabase = await createClient()

  if (enabled) {
    // Enroll in MFA
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    })

    if (error) throw error

    return {
      success: true,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      id: data.id,
    }
  } else {
    // Get enrolled factors
    const { data: factors } = await supabase.auth.mfa.listFactors()

    // Type guard: Check if TOTP factors exist and have at least one entry
    const totpFactors = factors?.totp
    if (Array.isArray(totpFactors) && totpFactors.length > 0 && totpFactors[0]) {
      // Unenroll from MFA
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: totpFactors[0].id,
      })

      if (error) throw error
    }

    return { success: true }
  }
}

/**
 * Delete user account (soft delete)
 */
export async function deleteAccount() {
  const session = await requireAuth()
  const logger = createOperationLogger('deleteAccount', { userId: session.user.id })
  logger.start()

  const supabase = await createClient()

  // Soft delete by marking profile as deleted
  const { error } = await supabase
    .schema('identity')
    .from('profiles')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by_id: session.user.id,
    })
    .eq('id', session.user.id)

  if (error) {
    logger.error(error, 'database', { userId: session.user.id })
    throw error
  }

  logger.success({ userId: session.user.id })

  // Sign out
  await supabase.auth.signOut()

  return { success: true }
}
