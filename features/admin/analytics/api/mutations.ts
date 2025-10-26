'use server'

import { revalidatePath } from 'next/cache'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

/**
 * Refresh analytics data by revalidating the analytics page
 * Use this instead of client-side fetch to maintain server-side rendering
 *
 * Security: Requires admin role to prevent unauthorized cache manipulation
 */
export async function refreshAnalytics() {
  // Verify admin authorization
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  revalidatePath('/admin/analytics')
  return { success: true }
}
