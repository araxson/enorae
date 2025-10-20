'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function deleteUsageTracking(_: FormData) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  console.warn('[Inventory] deleteUsageTracking is disabled until usage tracking backend is provisioned.')
  return { error: 'Inventory usage tracking is not yet available.' }
}
