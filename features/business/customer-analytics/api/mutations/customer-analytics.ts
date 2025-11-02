'use server'

import { revalidatePath } from 'next/cache'

import { verifySession } from '@/lib/auth/session'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function revalidateCustomerAnalytics() {
  const logger = createOperationLogger('revalidateCustomerAnalytics', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  revalidatePath('/business/analytics', 'page')
}
