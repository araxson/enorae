import { Suspense } from 'react'
import { getCustomerTransactions } from './api/queries'
import { TransactionsList } from './components/transactions-list'
import { Spinner } from '@/components/ui/spinner'

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

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          }
        >
          <CustomerTransactions />
        </Suspense>
      </div>
    </section>
  )
}

export { getCustomerTransactions, getCustomerTransactionById } from './api/queries'
export type { CustomerTransactionWithDetails } from './api/queries'
