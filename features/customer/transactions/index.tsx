import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Suspense } from 'react'
import { getCustomerTransactions } from './api/queries'
import { TransactionsList, TransactionsSkeleton } from './components'

export async function CustomerTransactions() {
  const transactions = await getCustomerTransactions()

  return <TransactionsList transactions={transactions} />
}

export function CustomerTransactionsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-2">
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle>Transaction History</ItemTitle>
              <ItemDescription>
                View all your payment transactions and receipts
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <Suspense
          fallback={<TransactionsSkeleton />}
        >
          <CustomerTransactions />
        </Suspense>
      </div>
    </section>
  )
}

export { getCustomerTransactions, getCustomerTransactionById } from './api/queries'
export type { CustomerTransactionWithDetails } from './api/queries'
export type * from './api/types'
