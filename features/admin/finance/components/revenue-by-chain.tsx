import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { ChainRevenueData } from '@/features/admin/finance/types'

interface RevenueByChainProps {
  data: ChainRevenueData[]
}

export function RevenueByChain({ data }: RevenueByChainProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalRevenue = data.reduce((sum, row) => sum + row.totalRevenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Chain</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain Name</TableHead>
              <TableHead className="text-right">Salons</TableHead>
              <TableHead className="text-right">Total Revenue</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
              <TableHead className="text-right">Avg per Salon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No chain revenue data available</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.chainName}>
                  <TableCell className="font-medium">{row.chainName}</TableCell>
                  <TableCell className="text-right">{row.salonCount}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(row.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {((row.totalRevenue / totalRevenue) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totalRevenue / row.salonCount)}
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
