import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { ChainAnalytics } from '../api/queries'

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
        <CardTitle>Chain Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No chain analytics available
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
                      <Badge variant="outline" className="capitalize">
                        {chain.subscriptionTier || 'Free'}
                      </Badge>
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
