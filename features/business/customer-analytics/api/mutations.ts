'use server'

import { revalidatePath } from 'next/cache'

import { verifySession } from '@/lib/auth/session'

export async function revalidateCustomerAnalytics() {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  revalidatePath('/business/analytics')
}
