import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { ChainAnalytics } from '@/features/admin/chains/api/queries'
import { Item, ItemContent, ItemGroup } from '@/components/ui/item'

interface ChainAnalyticsTableProps {
  analytics: ChainAnalytics[]
}

export function ChainAnalyticsTable({ analytics }: ChainAnalyticsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatRating = (value: number) => {
    return value.toFixed(1)
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Chain Analytics</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain Name</TableHead>
              <TableHead className="text-right">Salons</TableHead>
              <TableHead className="text-right">Staff</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
              <TableHead className="text-right">Avg Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No chain analytics available</EmptyTitle>
                      <EmptyDescription>Insights appear once chains accumulate operational data.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              analytics.map((chain) => (
                <TableRow key={chain.chainId}>
                  <TableCell className="font-medium">{chain.chainName}</TableCell>
                  <TableCell className="text-right">{chain.totalSalons}</TableCell>
                  <TableCell className="text-right">{chain.totalStaff}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(chain.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">{chain.totalAppointments}</TableCell>
                  <TableCell className="text-right">
                    {chain.avgRating > 0 ? (
                      <span className="font-medium">⭐ {formatRating(chain.avgRating)}</span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={chain.verificationStatus ? 'default' : 'secondary'}>
                      {chain.verificationStatus ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(chain.subscriptionTier || 'Free').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </Badge>
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
