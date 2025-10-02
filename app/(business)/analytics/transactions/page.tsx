import { ManualTransactions } from '@/features/manual-transactions'
import { getManualTransactions } from '@/features/manual-transactions/dal/manual-transactions.queries'

export const metadata = {
  title: 'Manual Transactions',
  description: 'Track manual financial transactions',
}

export default async function ManualTransactionsPage() {
  const transactions = await getManualTransactions()
  return <ManualTransactions initialTransactions={transactions} />
}
