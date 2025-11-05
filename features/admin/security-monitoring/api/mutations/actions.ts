'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Refresh security monitoring data by revalidating the page
 * Use this instead of client-side fetch to maintain server-side rendering
 *
 * Security: Requires admin role to prevent unauthorized cache manipulation
 */
export async function refreshSecurityMonitoring(): Promise<{ success: true }> {
  const logger = createOperationLogger('refreshSecurityMonitoring', {})
  logger.start()

  // Verify admin authorization
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  revalidatePath('/admin/security-monitoring', 'page')
  return { success: true }
}
