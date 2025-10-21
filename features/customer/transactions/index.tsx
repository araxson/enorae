import { getCustomerTransactions } from './api/queries'
import { TransactionsList } from './components/transactions-list'

export async function CustomerTransactions() {
  const transactions = await getCustomerTransactions()

  return <TransactionsList transactions={transactions} />
}

export function CustomerTransactionsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Transaction History</h1>
          <p className="leading-7 text-muted-foreground">
            View all your payment transactions and receipts
          </p>
        </div>

        <CustomerTransactions />
      </div>
    </section>
  )
}

export { getCustomerTransactions, getCustomerTransactionById } from './api/queries'
export type { CustomerTransactionWithDetails } from './api/queries'
