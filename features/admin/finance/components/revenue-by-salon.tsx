import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { AdminRevenueRow } from '../api/types'

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
      <CardContent>
        <div className="rounded-md border">
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No revenue data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={`${row.salon_id}-${index}`}>
                    <TableCell className="font-medium">
                      {row.salon_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {row.chain_name ? (
                        <Badge variant="outline">{row.chain_name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Independent</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(row.total_revenue))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(row.service_revenue))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(row.product_revenue))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(row.completed_appointments)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(Number(row.utilization_rate))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
