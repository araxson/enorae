import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UsageTrend } from '../../api/queries'
import { formatCurrency, formatNumber } from './utils'

interface UsageTrendsTableProps {
  trends: UsageTrend[]
}

export function UsageTrendsTable({ trends }: UsageTrendsTableProps) {
  if (trends.length === 0) return null

  const recentTrends = trends.slice(-10)
  const summary = recentTrends.reduce(
    (acc, trend) => {
      acc.quantity += trend.total_quantity
      acc.cost += trend.total_cost
      acc.products += trend.product_count
      return acc
    },
    { quantity: 0, cost: 0, products: 0 }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Trends (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Daily product usage and cost trends for the ten most recent reporting days.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Products Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTrends.map((trend) => (
              <TableRow key={trend.date}>
                <TableCell>
                  {new Date(trend.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">{formatNumber(trend.total_quantity)}</TableCell>
                <TableCell className="text-right">{formatCurrency(trend.total_cost)}</TableCell>
                <TableCell className="text-right">{trend.product_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold text-right">10-day totals</TableCell>
              <TableCell className="text-right font-semibold">{formatNumber(summary.quantity)}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(summary.cost)}</TableCell>
              <TableCell className="text-right font-semibold">{summary.products}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
