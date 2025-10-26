import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SalonPerformance } from '@/features/admin/appointments/types'

interface SalonPerformanceTableProps {
  salons: SalonPerformance[]
}

const formatPercent = (num: number, denom: number) => {
  if (!denom) return '0%'
  return `${((num / denom) * 100).toFixed(1)}%`
}

export function SalonPerformanceTable({ salons }: SalonPerformanceTableProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Top Performing Salons</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {salons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No salon metrics returned.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Cancellation %</TableHead>
                <TableHead>No-show %</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.map((salon) => (
                <TableRow key={salon.salonId}>
                  <TableCell className="font-medium text-foreground">{salon.salonName || salon.salonId}</TableCell>
                  <TableCell>{salon.total}</TableCell>
                  <TableCell>{salon.completed}</TableCell>
                  <TableCell>{formatPercent(salon.cancelled, salon.total)}</TableCell>
                  <TableCell>{formatPercent(salon.noShow, salon.total)}</TableCell>
                  <TableCell>${salon.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{Math.round(salon.avgDuration)} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
