import { Section, Stack, Box } from '@/components/layout'
import { getCustomerTransactions } from './api/queries'
import { TransactionsList } from './components/transactions-list'

export async function CustomerTransactions() {
  const transactions = await getCustomerTransactions()

  return <TransactionsList transactions={transactions} />
}

export function CustomerTransactionsPage() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Transaction History</h1>
          <p className="leading-7 text-muted-foreground">
            View all your payment transactions and receipts
          </p>
        </Box>

        <CustomerTransactions />
      </Stack>
    </Section>
  )
}

export { getCustomerTransactions, getCustomerTransactionById } from './api/queries'
export type { CustomerTransactionWithDetails } from './api/queries'
