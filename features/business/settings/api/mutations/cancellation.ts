'use server'
import 'server-only'

import { z } from 'zod'
import { getSalonContext, revalidateSettings } from './helpers'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

const cancellationPolicySchema = z.object({
  cancellation_hours: z.number().int().min(0).max(168),
  cancellation_fee_percentage: z.number().min(0).max(100).optional(),
  no_show_fee_percentage: z.number().min(0).max(100).optional(),
})

export async function updateCancellationPolicy(
  salonId: string,
  formData: FormData,
) {
  const logger = createOperationLogger('updateCancellationPolicy', {})
  logger.start()

  try {
    const supabase = await getSalonContext(salonId)

    const validated = cancellationPolicySchema.parse({
      cancellation_hours: Number(formData.get('cancellation_hours')),
      cancellation_fee_percentage: formData.get('cancellation_fee_percentage')
        ? Number(formData.get('cancellation_fee_percentage'))
        : undefined,
      no_show_fee_percentage: formData.get('no_show_fee_percentage')
        ? Number(formData.get('no_show_fee_percentage'))
        : undefined,
    })

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) throw error

    revalidateSettings()
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    if (error instanceof z.ZodError) {
      return { error: `Validation failed: ${error.issues[0]?.message}` }
    }
    return { error: 'Failed to update cancellation policy' }
  }
}
