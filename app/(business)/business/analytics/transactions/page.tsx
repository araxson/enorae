import { ManualTransactions } from '@/features/business/transactions'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Manual Transactions',
  description: 'Track and reconcile manual financial transactions',
  noIndex: true,
})

export default async function ManualTransactionsPage() {
  return <ManualTransactions />
}
