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
import { Badge } from '@/components/ui/badge'
import { formatNumber } from './utils'

interface HighUsageTableProps {
  highUsageProducts: Awaited<ReturnType<typeof import('../../api/queries').getHighUsageProducts>>
}

export function HighUsageTable({ highUsageProducts }: HighUsageTableProps) {
  if (highUsageProducts.length === 0) return null

  const summary = highUsageProducts.reduce(
    (acc, product) => {
      acc.dailyAverage += product.daily_average
      acc.currentStock += product.current_stock
      if (product.days_until_reorder <= 3) {
        acc.critical += 1
      } else if (product.days_until_reorder <= 7) {
        acc.reorderSoon += 1
      } else {
        acc.ok += 1
      }
      return acc
    },
    { dailyAverage: 0, currentStock: 0, critical: 0, reorderSoon: 0, ok: 0 }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>High Usage Products & Stock Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Products consuming inventory fastest with remaining stock estimates and reorder urgency.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">SKU</TableHead>
              <TableHead className="text-right">Daily Avg</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Days Until Reorder</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {highUsageProducts.map((product) => {
              const needsReorder = product.days_until_reorder <= 7
              const critical = product.days_until_reorder <= 3

              return (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {product.product_sku || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(product.daily_average)} {product.product_unit || 'units'}/day
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(product.current_stock)} {product.product_unit || 'units'}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.days_until_reorder > 0
                      ? `${product.days_until_reorder} days`
                      : 'Below minimum'}
                  </TableCell>
                  <TableCell className="text-right">
                    {critical ? (
                      <Badge variant="destructive">Critical</Badge>
                    ) : needsReorder ? (
                      <Badge variant="secondary">Reorder Soon</Badge>
                    ) : (
                      <Badge variant="outline">OK</Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium text-foreground">Summary</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {highUsageProducts.length} products
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(summary.dailyAverage)} total/day
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(summary.currentStock)} units on hand
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {summary.critical} critical • {summary.reorderSoon} reorder soon
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {summary.ok} stable
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
