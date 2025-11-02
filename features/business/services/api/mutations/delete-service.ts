'use server'
import 'server-only'

import { createOperationLogger } from '@/lib/observability'
import { revalidatePath } from 'next/cache'
import { assertSalonAccess, ensureBusinessUser } from './shared'
import type { MutationOptions } from '@/lib/types/mutations'

export async function deleteService(serviceId: string, options: MutationOptions = {}) {
  const logger = createOperationLogger('deleteService', { serviceId })
  logger.start()

  const session = options.session ?? await ensureBusinessUser()
  const { supabase } = await assertSalonAccess(serviceId, options.supabase, {
    skipAccessCheck: options.skipAccessCheck,
  })
  const timestamp = (options.now?.() ?? new Date()).toISOString()

  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .update({
      discontinued_at: timestamp,
      deleted_at: timestamp,
      deleted_by_id: session.user.id,
      is_active: false,
      is_bookable: false,
      updated_by_id: session.user.id,
      updated_at: timestamp,
    })
    .eq('id', serviceId)

  if (error) {
    logger.error('Service deletion failed', 'database', { error })
    throw error
  }

  logger.success()
  revalidatePath('/business/services', 'page')
  return { success: true }
}
