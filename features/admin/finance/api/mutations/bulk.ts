'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function bulkUpdateTransactionStatus(data: {
  transactionIds: string[]
  status: string
  reason?: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('bulkUpdateTransactionStatus is not implemented for the Admin Portal yet.')
}
