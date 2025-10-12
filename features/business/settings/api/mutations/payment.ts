import 'server-only'

import { z } from 'zod'
import { getSalonContext, revalidateSettings } from './helpers'

const paymentMethodsSchema = z.object({
  payment_methods: z.array(z.string()).min(1),
})

function parseMethods(raw: FormDataEntryValue | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(String(raw))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function updatePaymentMethods(
  salonId: string,
  formData: FormData,
) {
  try {
    const supabase = await getSalonContext(salonId)

    const methods = parseMethods(formData.get('payment_methods'))

    const validated = paymentMethodsSchema.parse({
      payment_methods: methods,
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
    console.error('Error updating payment methods:', error)
    if (error instanceof z.ZodError) {
      return { error: `Validation failed: ${error.errors[0]?.message}` }
    }
    return { error: 'Failed to update payment methods' }
  }
}
