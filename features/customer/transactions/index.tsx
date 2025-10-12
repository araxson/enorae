import { Section, Stack, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
          <H1>Transaction History</H1>
          <P className="text-muted-foreground">
            View all your payment transactions and receipts
          </P>
        </Box>

        <CustomerTransactions />
      </Stack>
    </Section>
  )
}

export { getCustomerTransactions, getCustomerTransactionById } from './api/queries'
export type { CustomerTransactionWithDetails } from './api/queries'
