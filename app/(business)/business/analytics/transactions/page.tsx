import { ManualTransactions } from '@/features/business/transactions'

export const metadata = {
  title: 'Manual Transactions',
  description: 'Track manual financial transactions',
}

export default async function ManualTransactionsPage() {
  return <ManualTransactions />
}
