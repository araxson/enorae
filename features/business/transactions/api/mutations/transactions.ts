'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { z } from 'zod'
import { createOperationLogger, logMutation, logPayment } from '@/lib/observability'
import { manualTransactionSchema } from '../schema'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

  const logger = createOperationLogger('createManualTransaction', {})
  logger.start({ transactionType, paymentMethod })

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
      logger.error('User salon not found', 'not_found', { userId: session.user.id })
      return { error: 'User salon not found' }
    }

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
      logger.error(error, 'database', {
        userId: session.user.id,
        salonId: staffProfile.salon_id,
      })
      return { error: error.message }
    }

    logPayment('create_manual_transaction', {
      userId: session.user.id,
      salonId: staffProfile.salon_id,
      appointmentId: validated.appointment_id,
      customerId: validated.customer_id,
      operationName: 'createManualTransaction',
      paymentMethod: validated.payment_method,
      status: 'completed',
    })

    revalidatePath('/business/analytics/transactions', 'page')

    logger.success({
      userId: session.user.id,
      salonId: staffProfile.salon_id,
      appointmentId: validated.appointment_id,
      customerId: validated.customer_id,
    })

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(error.issues[0]?.message ?? 'Validation failed', 'validation')
      return { error: error.issues[0]?.message ?? 'Validation failed' }
    }
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to create manual transaction' }
  }
}

/**
 * Delete a manual transaction
 */
export async function deleteManualTransaction(id: string): Promise<ActionResult> {
  const logger = createOperationLogger('deleteManualTransaction', {})
  logger.start()

  try {
    // Validate ID
    if (!UUID_REGEX.test(id)) {
      logger.error('Invalid transaction ID', 'validation')
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
      logger.error('User salon not found', 'not_found', { userId: session.user.id })
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
      logger.error('Transaction not found or unauthorized', 'permission', {
        userId: session.user.id,
        userSalonId: staffProfile.salon_id,
        transactionSalonId: transaction?.salon_id,
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
      logger.error(error, 'database', {
        userId: session.user.id,
        salonId: staffProfile.salon_id,
      })
      return { error: error.message }
    }

    logMutation('delete', 'manual_transaction', id, {
      userId: session.user.id,
      salonId: staffProfile.salon_id,
      operationName: 'deleteManualTransaction',
    })

    revalidatePath('/business/analytics/transactions', 'page')

    logger.success({ userId: session.user.id, salonId: staffProfile.salon_id })

    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'Failed to delete transaction' }
  }
}
