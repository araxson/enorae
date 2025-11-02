'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Refresh analytics data by revalidating the analytics page
 * Use this instead of client-side fetch to maintain server-side rendering
 *
 * Security: Requires admin role to prevent unauthorized cache manipulation
 */
export async function refreshAnalytics() {
  const logger = createOperationLogger('refreshAnalytics', {})
  logger.start()

  // Verify admin authorization
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  revalidatePath('/admin/analytics', 'page')
  return { success: true }
}
