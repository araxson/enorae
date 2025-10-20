import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateTransactionsMetadata() {
  return genMeta({
    title: 'Payment History',
    description: 'View your payment history, receipts, and transaction details for all your salon appointments.',
    keywords: ['transactions', 'payment history', 'receipts', 'invoices', 'billing history', 'payments'],
  })
}
