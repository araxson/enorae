'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function bulkRecordUsage(_: FormData) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  console.warn('[Inventory] bulkRecordUsage is disabled until usage tracking backend is provisioned.')
  return { error: 'Inventory usage tracking is not yet available.' }
}
