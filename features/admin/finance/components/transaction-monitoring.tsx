import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/features/shared/ui-components'
import { Activity, CreditCard, Users, Building2 } from 'lucide-react'
import type { TransactionMetrics, ManualTransactionRow } from '@/features/admin/finance/api/types'

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
    const m = (method || '').toLowerCase()
    if (m.includes('card') || m.includes('credit') || m.includes('debit')) return 'default'
    if (m.includes('cash')) return 'secondary'
    if (m.includes('online')) return 'outline'
    return 'outline'
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Transactions"
          value={metrics.totalTransactions.toString()}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Unique Salons"
          value={metrics.uniqueSalons.toString()}
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          label="Unique Customers"
          value={metrics.uniqueCustomers.toString()}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Payment Methods"
          value={Object.keys(metrics.paymentMethods).length.toString()}
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No recent transactions
                  </TableCell>
                </TableRow>
              ) : (
                metrics.recentTransactions.map((transaction) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
