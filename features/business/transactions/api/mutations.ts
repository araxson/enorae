'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const manualTransactionSchema = z.object({
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
  customer_id: z.string().regex(UUID_REGEX, 'Invalid customer ID').optional(),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  transaction_at: z.string().min(1, 'Transaction date is required'),
  transaction_type: z.enum(['payment', 'refund', 'adjustment', 'fee', 'other'], {
    errorMap: () => ({ message: 'Invalid transaction type' }),
  }),
  payment_method: z.string().min(1, 'Payment method is required'),
})

export type ActionResult = {
  success?: boolean
  error?: string
  data?: unknown
}

/**
 * Create a manual transaction
 */
export async function createManualTransaction(formData: FormData): Promise<ActionResult> {
  try {
    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const supabase = await createClient()

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Parse and validate input
    const input = {
      appointment_id: formData.get('appointmentId') as string || undefined,
      customer_id: formData.get('customerId') as string || undefined,
      staff_id: formData.get('staffId') as string || undefined,
      transaction_at: formData.get('transactionAt') as string,
      transaction_type: formData.get('transactionType') as string,
      payment_method: formData.get('paymentMethod') as string,
    }

    const validated = manualTransactionSchema.parse(input)

    // Create transaction
    const { data, error } = await supabase
      .schema('analytics')
      .from('manual_transactions')
      .insert({
        salon_id: staffProfile.salon_id,
        appointment_id: validated.appointment_id || null,
        customer_id: validated.customer_id || null,
        staff_id: validated.staff_id || null,
        transaction_at: validated.transaction_at,
        transaction_type: validated.transaction_type,
        payment_method: validated.payment_method,
        created_by_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/analytics/transactions')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'Failed to create manual transaction' }
  }
}

/**
 * Delete a manual transaction
 */
export async function deleteManualTransaction(id: string): Promise<ActionResult> {
  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      return { error: 'Invalid transaction ID' }
    }

    // SECURITY: Require business role
    const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

    const supabase = await createClient()

    // Get user's salon
    const { data: staffProfile } = await supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .single<{ salon_id: string | null }>()

    if (!staffProfile?.salon_id) {
      return { error: 'User salon not found' }
    }

    // Verify transaction belongs to user's salon
    const { data: transaction } = await supabase
      .schema('analytics')
      .from('manual_transactions')
      .select('salon_id')
      .eq('id', id)
      .single<{ salon_id: string | null }>()

    if (!transaction || transaction.salon_id !== staffProfile.salon_id) {
      return { error: 'Transaction not found or unauthorized' }
    }

    // Delete transaction
    const { error } = await supabase
      .schema('analytics')
      .from('manual_transactions')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/business/analytics/transactions')

    return { success: true }
  } catch {
    return { error: 'Failed to delete transaction' }
  }
}
