'use server'
import 'server-only'

import { z } from 'zod'
import { getSalonContext, revalidateSettings } from './helpers'
import { createOperationLogger } from '@/lib/observability'
import { safeJsonParseStringArray } from '@/lib/utils/safe-json'

const paymentMethodsSchema = z.object({
  payment_methods: z.array(z.string()).min(1),
})

const methodsArraySchema = z.array(z.string())

function parseMethods(raw: FormDataEntryValue | null): string[] {
  if (!raw) return []
  const parsed = safeJsonParseStringArray(String(raw), [])
  const validated = methodsArraySchema.safeParse(parsed)
  return validated.success ? validated.data : []
}

export async function updatePaymentMethods(
  salonId: string,
  formData: FormData,
) {
  const logger = createOperationLogger('updatePaymentMethods', { salonId })
  logger.start()

  try {
    const supabase = await getSalonContext(salonId)

    const methods = parseMethods(formData.get('payment_methods'))

    const validation = paymentMethodsSchema.safeParse({
      payment_methods: methods,
    })

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(`Validation failed: ${firstError?.message}`, 'validation')
      return { error: firstError?.message ?? 'Invalid payment methods input' }
    }

    const validated = validation.data

    logger.start({ salonId, methodCount: methods.length })

    const { error } = await supabase
      .schema('organization')
      .from('salon_settings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('salon_id', salonId)

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    revalidateSettings()

    logger.success({ salonId, methodCount: methods.length })
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error(`Validation failed: ${error.issues[0]?.message}`, 'validation')
      return { error: `Validation failed: ${error.issues[0]?.message}` }
    }
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to update payment methods' }
  }
}
