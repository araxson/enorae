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
  const transactionType = formData.get('transactionType') as string
  const paymentMethod = formData.get('paymentMethod') as string

  console.log('Starting manual transaction creation', {
    transactionType,
    paymentMethod,
    timestamp: new Date().toISOString()
  })

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
      console.error('createManualTransaction user salon not found', {
        userId: session.user.id
      })
      return { error: 'User salon not found' }
    }

    console.log('createManualTransaction user salon verified', {
      userId: session.user.id,
      salonId: staffProfile.salon_id
    })

    // Parse and validate input
    const input = {
      appointment_id: formData.get('appointmentId') as string || undefined,
      customer_id: formData.get('customerId') as string || undefined,
      staff_id: formData.get('staffId') as string || undefined,
      transaction_at: formData.get('transactionAt') as string,
      transaction_type: transactionType,
      payment_method: paymentMethod,
    }

    const validated = manualTransactionSchema.parse(input)

    console.log('createManualTransaction validation passed', {
      userId: session.user.id,
      salonId: staffProfile.salon_id,
      transactionType: validated.transaction_type,
      paymentMethod: validated.payment_method,
      appointmentId: validated.appointment_id,
      customerId: validated.customer_id
    })

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
      console.error('createManualTransaction insert failed', {
        userId: session.user.id,
        salonId: staffProfile.salon_id,
        transactionType: validated.transaction_type,
        paymentMethod: validated.payment_method,
        error: error.message
      })
      return { error: error.message }
    }

    console.log('createManualTransaction completed successfully', {
      userId: session.user.id,
      transactionId: data.id,
      salonId: staffProfile.salon_id,
      transactionType: validated.transaction_type,
      paymentMethod: validated.payment_method,
      appointmentId: validated.appointment_id,
      customerId: validated.customer_id
    })

    revalidatePath('/business/analytics/transactions')

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('createManualTransaction validation error', {
        error: error.issues[0]?.message ?? 'Validation failed',
        errors: error.issues
      })
      return { error: error.issues[0]?.message ?? 'Validation failed' }
    }
    console.error('createManualTransaction unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { error: 'Failed to create manual transaction' }
  }
}

/**
 * Delete a manual transaction
 */
export async function deleteManualTransaction(id: string): Promise<ActionResult> {
  console.log('Starting manual transaction deletion', { transactionId: id, timestamp: new Date().toISOString() })

  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      console.error('deleteManualTransaction invalid ID format', { transactionId: id })
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
      console.error('deleteManualTransaction user salon not found', {
        userId: session.user.id,
        transactionId: id
      })
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
      console.error('deleteManualTransaction unauthorized access attempt', {
        userId: session.user.id,
        userSalonId: staffProfile.salon_id,
        transactionId: id,
        transactionSalonId: transaction?.salon_id
      })
      return { error: 'Transaction not found or unauthorized' }
    }

    // Delete transaction
    const { error } = await supabase
      .schema('analytics')
      .from('manual_transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('deleteManualTransaction delete failed', {
        userId: session.user.id,
        transactionId: id,
        salonId: staffProfile.salon_id,
        error: error.message
      })
      return { error: error.message }
    }

    console.log('deleteManualTransaction completed successfully', {
      userId: session.user.id,
      transactionId: id,
      salonId: staffProfile.salon_id
    })

    revalidatePath('/business/analytics/transactions')

    return { success: true }
  } catch (error) {
    console.error('deleteManualTransaction unexpected error', {
      transactionId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { error: 'Failed to delete transaction' }
  }
}
