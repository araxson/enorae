import { getManualTransactions } from './api/queries'
import { TransactionsClient } from './components'

export async function ManualTransactions() {
  const transactions = await getManualTransactions()

  // TODO: Fetch staff and customer options for the dropdown
  // For now, passing empty arrays - can be enhanced later
  const staffOptions: Array<{ id: string; full_name: string | null }> = []
  const customerOptions: Array<{ id: string; full_name: string | null; email?: string | null }> = []

  return (
    <TransactionsClient
      transactions={transactions}
      staffOptions={staffOptions}
      customerOptions={customerOptions}
    />
  )
}
export type * from './api/types'
