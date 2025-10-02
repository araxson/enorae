import { TransactionsList } from './components/transactions-list'
import type { ManualTransactionWithDetails } from './dal/manual-transactions.queries'

type ManualTransactionsProps = {
  initialTransactions: ManualTransactionWithDetails[]
}

export function ManualTransactions({ initialTransactions }: ManualTransactionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <H2>Manual Transactions</H2>
        <Muted className="mt-1">
          Track manual financial transactions and adjustments
        </Muted>
      </div>

      <TransactionsList transactions={initialTransactions} />
    </div>
  )
}
