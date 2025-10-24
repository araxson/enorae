import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { PaymentMethodStats } from '@/features/admin/finance/api/types'

interface PaymentMethodStatsProps {
  stats: PaymentMethodStats[]
}

export function PaymentMethodStatsComponent({ stats }: PaymentMethodStatsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getMethodIcon = (method: string) => {
    const m = method.toLowerCase()
    if (m.includes('card') || m.includes('credit') || m.includes('debit')) return '💳'
    if (m.includes('cash')) return '💵'
    if (m.includes('online') || m.includes('digital')) return '📱'
    if (m.includes('wallet')) return '👛'
    return '💰'
  }

  const totalTransactions = stats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead>Distribution</TableHead>
                <TableHead className="text-right">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payment method data available
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((stat) => (
                  <TableRow key={stat.method}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMethodIcon(stat.method)}</span>
                        <span className="font-medium capitalize">{stat.method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stat.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {stat.percentage.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatDate(stat.lastUsed)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {stats.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Transactions: {totalTransactions.toLocaleString()}</span>
            <span>Methods Available: {stats.length}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
