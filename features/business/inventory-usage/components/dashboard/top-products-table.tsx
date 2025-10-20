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
import type { UsageAnalytics } from '../../api/queries'
import { formatCurrency, formatNumber } from './utils'

interface TopProductsTableProps {
  analytics: UsageAnalytics
}

export function TopProductsTable({ analytics }: TopProductsTableProps) {
  const summary = analytics.topProducts.reduce(
    (acc, product) => {
      acc.quantity += product.total_quantity
      acc.cost += product.total_cost
      acc.uses += product.usage_count
      return acc
    },
    { quantity: 0, cost: 0, uses: 0 }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Products incurring the highest inventory spend within the current analytics period.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Uses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.topProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="font-medium">{product.product_name}</TableCell>
                <TableCell className="text-right">{formatNumber(product.total_quantity)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.total_cost)}</TableCell>
                <TableCell className="text-right">{product.usage_count}</TableCell>
              </TableRow>
            ))}
            {analytics.topProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No product usage data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {analytics.topProducts.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold text-right">Totals</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(summary.quantity)}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(summary.cost)}</TableCell>
                <TableCell className="text-right font-semibold">{summary.uses}</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
