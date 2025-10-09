'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type ManualTransactionInsert = Database['analytics']['Tables']['manual_transactions']['Insert']
type FinancialTransactionInsert = Database['private']['Tables']['financial_transactions']['Insert']

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Record a cash payment
 */
const recordCashPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  appointmentId: z.string().regex(UUID_REGEX).optional(),
  customerId: z.string().regex(UUID_REGEX).optional(),
  staffId: z.string().regex(UUID_REGEX).optional(),
  notes: z.string().optional(),
  transactionAt: z.string().datetime().optional(),
})

export async function recordCashPayment(input: {
  amount: number
  appointmentId?: string
  customerId?: string
  staffId?: string
  notes?: string
  transactionAt?: string
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = recordCashPaymentSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { amount, appointmentId, customerId, staffId, notes, transactionAt } =
    validation.data

  // Record in manual_transactions
  const transactionData: ManualTransactionInsert = {
    salon_id: salonId,
    transaction_type: 'cash_payment',
    payment_method: 'cash',
    transaction_at: transactionAt || new Date().toISOString(),
    appointment_id: appointmentId,
    customer_id: customerId,
    staff_id: staffId,
    created_by_id: user.id,
  }

  const { error: manualError } = await supabase
    .schema('analytics')
    .from('manual_transactions')
    .insert(transactionData)

  if (manualError) throw manualError

  // Also record in financial_transactions for payment tracking
  const financialData: FinancialTransactionInsert = {
    salon_id: salonId,
    customer_id: customerId,
    amount,
    payment_method: 'cash',
    metadata: {
      type: 'cash_payment',
      appointment_id: appointmentId,
      staff_id: staffId,
      notes,
      recorded_by: user.id,
    },
  }

  const { error: financialError } = await supabase
    .schema('private')
    .from('financial_transactions')
    .insert(financialData)

  if (financialError) throw financialError

  revalidatePath('/business/transactions')
  return { success: true, amount, paymentMethod: 'cash' }
}

/**
 * Process a refund
 */
const processRefundSchema = z.object({
  originalTransactionId: z.string().regex(UUID_REGEX),
  refundAmount: z.number().positive('Refund amount must be positive'),
  reason: z.string().min(1, 'Refund reason is required'),
  refundMethod: z.enum(['cash', 'card', 'online', 'original_payment_method']),
})

export async function processRefund(input: {
  originalTransactionId: string
  refundAmount: number
  reason: string
  refundMethod: 'cash' | 'card' | 'online' | 'original_payment_method'
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = processRefundSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { originalTransactionId, refundAmount, reason, refundMethod } = validation.data

  // Verify original transaction belongs to salon
  const { data: originalTx, error: fetchError } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('id', originalTransactionId)
    .single()

  if (fetchError) throw fetchError
  if (!originalTx) throw new Error('Original transaction not found')

  const originalSalonId = (originalTx as { salon_id: string | null }).salon_id
  if (originalSalonId !== salonId) {
    throw new Error('Transaction does not belong to your salon')
  }

  const originalAmount = (originalTx as { amount: number }).amount
  if (refundAmount > originalAmount) {
    throw new Error('Refund amount cannot exceed original transaction amount')
  }

  // Determine refund method
  let finalRefundMethod = refundMethod
  if (refundMethod === 'original_payment_method') {
    const originalMethod = (originalTx as { payment_method: string | null }).payment_method
    finalRefundMethod = (originalMethod as 'cash' | 'card' | 'online') || 'cash'
  }

  // Record refund transaction
  const refundData: FinancialTransactionInsert = {
    salon_id: salonId,
    customer_id: (originalTx as { customer_id: string | null }).customer_id,
    amount: -refundAmount, // Negative amount for refund
    payment_method: finalRefundMethod,
    metadata: {
      type: 'refund',
      original_transaction_id: originalTransactionId,
      reason,
      refunded_by: user.id,
      refund_date: new Date().toISOString(),
    },
  }

  const { error: refundError } = await supabase
    .schema('private')
    .from('financial_transactions')
    .insert(refundData)

  if (refundError) throw refundError

  revalidatePath('/business/transactions')
  return {
    success: true,
    refundAmount,
    originalTransactionId,
    refundMethod: finalRefundMethod,
  }
}

/**
 * Void a transaction
 */
const voidTransactionSchema = z.object({
  transactionId: z.string().regex(UUID_REGEX),
  reason: z.string().min(1, 'Void reason is required'),
})

export async function voidTransaction(input: {
  transactionId: string
  reason: string
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = voidTransactionSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { transactionId, reason } = validation.data

  // Verify transaction belongs to salon
  const { data: transaction, error: fetchError } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (fetchError) throw fetchError
  if (!transaction) throw new Error('Transaction not found')

  const txSalonId = (transaction as { salon_id: string | null }).salon_id
  if (txSalonId !== salonId) {
    throw new Error('Transaction does not belong to your salon')
  }

  const txAmount = (transaction as { amount: number }).amount

  // Check if already voided
  const existingMetadata = (transaction as { metadata: unknown }).metadata as
    | Record<string, unknown>
    | null
  if (existingMetadata && existingMetadata.voided === true) {
    throw new Error('Transaction is already voided')
  }

  // Update transaction to mark as voided
  const { error: updateError } = await supabase
    .schema('private')
    .from('financial_transactions')
    .update({
      metadata: {
        ...existingMetadata,
        voided: true,
        void_reason: reason,
        voided_by: user.id,
        voided_at: new Date().toISOString(),
      },
    })
    .eq('id', transactionId)

  if (updateError) throw updateError

  // Create a reversing entry
  const reversingData: FinancialTransactionInsert = {
    salon_id: salonId,
    customer_id: (transaction as { customer_id: string | null }).customer_id,
    amount: -txAmount,
    payment_method: (transaction as { payment_method: string | null }).payment_method,
    metadata: {
      type: 'void_reversal',
      original_transaction_id: transactionId,
      reason,
      voided_by: user.id,
    },
  }

  const { error: reversingError } = await supabase
    .schema('private')
    .from('financial_transactions')
    .insert(reversingData)

  if (reversingError) throw reversingError

  revalidatePath('/business/transactions')
  return { success: true, transactionId, voided: true }
}

/**
 * Perform daily reconciliation
 */
const dailyReconciliationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expectedCash: z.number().nonnegative(),
  actualCash: z.number().nonnegative(),
  expectedCard: z.number().nonnegative(),
  actualCard: z.number().nonnegative(),
  notes: z.string().optional(),
})

export async function performDailyReconciliation(input: {
  date: string
  expectedCash: number
  actualCash: number
  expectedCard: number
  actualCard: number
  notes?: string
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const validation = dailyReconciliationSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { date, expectedCash, actualCash, expectedCard, actualCard, notes } =
    validation.data

  const cashVariance = actualCash - expectedCash
  const cardVariance = actualCard - expectedCard
  const totalVariance = cashVariance + cardVariance

  // Record reconciliation as a manual transaction
  const reconciliationData: ManualTransactionInsert = {
    salon_id: salonId,
    transaction_type: 'reconciliation',
    transaction_at: `${date}T23:59:59Z`,
    created_by_id: user.id,
  }

  const { error: recordError } = await supabase
    .schema('analytics')
    .from('manual_transactions')
    .insert(reconciliationData)

  if (recordError) throw recordError

  // If there's a variance, record it
  if (totalVariance !== 0) {
    const varianceData: FinancialTransactionInsert = {
      salon_id: salonId,
      amount: totalVariance,
      payment_method: 'adjustment',
      metadata: {
        type: 'daily_reconciliation',
        date,
        cash_variance: cashVariance,
        card_variance: cardVariance,
        expected_cash: expectedCash,
        actual_cash: actualCash,
        expected_card: expectedCard,
        actual_card: actualCard,
        notes,
        reconciled_by: user.id,
      },
    }

    const { error: varianceError } = await supabase
      .schema('private')
      .from('financial_transactions')
      .insert(varianceData)

    if (varianceError) throw varianceError
  }

  revalidatePath('/business/transactions')
  return {
    success: true,
    date,
    cashVariance,
    cardVariance,
    totalVariance,
    isBalanced: totalVariance === 0,
  }
}
