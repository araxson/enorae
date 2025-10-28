'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function flagTransaction(data: {
  transactionId: string
  reason: string
  priority: 'low' | 'medium' | 'high'
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('flagTransaction is not implemented for the Admin Portal yet.')
}
