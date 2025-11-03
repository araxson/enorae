import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/features/shared/ui-components'
import { Activity, CreditCard, Users, Building2 } from 'lucide-react'
import type { TransactionMetrics, ManualTransactionRow } from '@/features/admin/finance/api/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

interface TransactionMonitoringProps {
  metrics: TransactionMetrics
}

export function TransactionMonitoring({ metrics }: TransactionMonitoringProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodBadgeVariant = (method: string | null | undefined) => {
    const normalizedMethod = (method || '').toLowerCase()
    if (normalizedMethod.includes('card') || normalizedMethod.includes('credit') || normalizedMethod.includes('debit')) return 'default'
    if (normalizedMethod.includes('cash')) return 'secondary'
    if (normalizedMethod.includes('online')) return 'outline'
    return 'outline'
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Transactions"
          value={metrics.totalTransactions.toString()}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          label="Unique Salons"
          value={metrics.uniqueSalons.toString()}
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label="Unique Customers"
          value={metrics.uniqueCustomers.toString()}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Payment Methods"
          value={Object.keys(metrics.paymentMethods).length.toString()}
          icon={<CreditCard className="size-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Recent Transactions</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="-m-6">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Salon ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.recentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No recent transactions</EmptyTitle>
                        <EmptyDescription>Financial activity will display after payments are captured.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                metrics.recentTransactions.map((transaction: { id: string; salon_id: string | null; customer_id: string | null; amount: number; payment_method: string | null; transaction_type: string | null; created_at: string | null }) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.transaction_type || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                        {transaction.payment_method || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.salon_id?.slice(0, 8) || 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.customer_id?.slice(0, 8) || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
