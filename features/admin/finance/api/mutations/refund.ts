'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function processRefund(data: {
  transactionId: string
  amount: number
  reason: string
  notes?: string
}) {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  throw new Error('processRefund is not implemented for the Admin Portal yet.')
}
