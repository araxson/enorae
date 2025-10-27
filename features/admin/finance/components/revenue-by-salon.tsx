import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { AdminRevenueRow } from '@/features/admin/finance/types'

interface RevenueBySalonProps {
  data: AdminRevenueRow[]
}

export function RevenueBySalon({ data }: RevenueBySalonProps) {
  const formatCurrency = (value: number | null | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0)
  }

  const formatNumber = (value: number | null | undefined) => {
    return new Intl.NumberFormat('en-US').format(value || 0)
  }

  const formatPercentage = (value: number | null | undefined) => {
    return `${((value || 0) * 100).toFixed(1)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Salon</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Salon</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead className="text-right">Total Revenue</TableHead>
              <TableHead className="text-right">Service Revenue</TableHead>
              <TableHead className="text-right">Product Revenue</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
              <TableHead className="text-right">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No revenue data available</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={`revenue-${index}`}>
                  <TableCell className="font-medium">Aggregated Data</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(row.total_revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.service_revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.product_revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.completed_appointments)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
