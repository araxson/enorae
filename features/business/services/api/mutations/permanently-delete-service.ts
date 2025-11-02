'use server'
import 'server-only'

import { createOperationLogger } from '@/lib/observability'
import { revalidatePath } from 'next/cache'
import { assertSalonAccess, ensureBusinessUser } from './shared'
import type { MutationOptions } from '@/lib/types/mutations'

export async function permanentlyDeleteService(
  serviceId: string,
  options: MutationOptions = {},
) {
  const logger = createOperationLogger('permanentlyDeleteService', { serviceId })
  logger.start()

  await (options.session ? Promise.resolve(options.session) : ensureBusinessUser())
  const { supabase } = await assertSalonAccess(serviceId, options.supabase, {
    skipAccessCheck: options.skipAccessCheck,
  })

  const { data: appointments, error: checkError } = await supabase
    .from('appointments_view')
    .select('id')
    .eq('service_id', serviceId)
    .limit(1)

  if (checkError) {
    logger.error('Failed to check appointments', 'database', { error: checkError })
    throw checkError
  }

  if (appointments && appointments.length > 0) {
    logger.error('Service has existing appointments', 'validation')
    throw new Error('Cannot delete service with existing appointments. Use discontinue instead.')
  }

  const cleanupSteps = [
    supabase.schema('catalog').from('service_pricing').delete().eq('service_id', serviceId),
    supabase.schema('catalog').from('service_booking_rules').delete().eq('service_id', serviceId),
    supabase.schema('catalog').from('staff_services').delete().eq('service_id', serviceId),
    supabase.schema('scheduling').from('appointment_services').delete().eq('service_id', serviceId),
  ] as const

  for (const step of cleanupSteps) {
    const { error: cleanupError } = await step
    if (cleanupError && cleanupError.code !== 'PGRST116') {
      logger.error('Cleanup step failed', 'database', { error: cleanupError })
      throw cleanupError
    }
  }

  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .delete()
    .eq('id', serviceId)

  if (error) {
    logger.error('Service deletion failed', 'database', { error })
    throw error
  }

  logger.success()
  revalidatePath('/business/services', 'page')
  return { success: true }
}
