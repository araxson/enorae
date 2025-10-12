import { CustomerTransactionsPage } from '@/features/customer/transactions'

export const metadata = {
  title: 'Transaction History | Enorae',
  description: 'View your payment and transaction history',
}

export default async function TransactionsPage() {
  return <CustomerTransactionsPage />
}
