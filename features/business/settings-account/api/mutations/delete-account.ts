'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

/**
 * Delete user account (soft delete)
 * SECURITY: Follows GDPR compliance requirements
 * @see Pattern 27 in docs/rules/09-auth.md
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

  // CRITICAL: Sign out and revalidate to clear all cached data
  // @see docs/rules/09-auth.md - Pattern 7: Server Action Sign Out
  await supabase.auth.signOut()
  revalidatePath('/', 'layout') // Clear all cached data after sign out

  return { success: true }
}
