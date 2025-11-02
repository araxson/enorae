import { z } from 'zod'

/**
 * UUID validation regex for database IDs
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Transaction type enumeration
 */
export const transactionTypeEnum = z.enum(['payment', 'refund', 'adjustment', 'fee', 'other'])


/**
 * Payment method enumeration
 */
export const paymentMethodEnum = z.enum(
  ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'mobile_payment', 'other'],
  'Please select a valid payment method'
)

/**
 * Manual transaction creation schema
 * Used for creating transactions manually (not through appointment flow)
 */
export const manualTransactionSchema = z.object({
  appointment_id: z
    .string()
    .regex(UUID_REGEX, 'Invalid appointment ID format')
    .optional()
    .or(z.literal('')),
  customer_id: z
    .string()
    .regex(UUID_REGEX, 'Invalid customer ID format')
    .optional()
    .or(z.literal('')),
  staff_id: z
    .string()
    .regex(UUID_REGEX, 'Invalid staff ID format')
    .optional()
    .or(z.literal('')),
  transaction_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const transactionDate = new Date(date)
        const today = new Date()
        today.setHours(23, 59, 59, 999) // Allow today
        return transactionDate <= today
      },
      {
        message: 'Transaction date cannot be in the future',
      }
    ),
  transaction_type: transactionTypeEnum,
  payment_method: paymentMethodEnum,
  amount: z.coerce
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places')
    .optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or fewer').optional(),
})

/**
 * Transaction refund schema
 * Used for processing refunds for existing transactions
 */
export const transactionRefundSchema = z.object({
  transaction_id: z.string().regex(UUID_REGEX, 'Invalid transaction ID'),
  amount: z.coerce
    .number()
    .min(0.01, 'Refund amount must be greater than 0')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  reason: z.string().min(10, 'Please provide a reason for the refund (at least 10 characters)').max(500),
  refund_method: paymentMethodEnum,
})

/**
 * Transaction filter schema
 * Used for filtering transaction lists
 */
export const transactionFilterSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date format').optional(),
  transaction_type: transactionTypeEnum.optional(),
  payment_method: paymentMethodEnum.optional(),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  customer_id: z.string().regex(UUID_REGEX, 'Invalid customer ID').optional(),
  min_amount: z.coerce.number().min(0).optional(),
  max_amount: z.coerce.number().min(0).optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ManualTransactionSchema = z.infer<typeof manualTransactionSchema>
export type TransactionRefundSchema = z.infer<typeof transactionRefundSchema>
export type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>
