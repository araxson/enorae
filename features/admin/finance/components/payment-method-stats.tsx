import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { PaymentMethodStats } from '@/features/admin/finance/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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

  const formatMethodName = (method: string) => {
    return method.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
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
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Payment Method Statistics</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <ScrollArea className="px-6 pt-6">
          {stats.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No payment method data available</EmptyTitle>
                <EmptyDescription>Connect a processor or import transactions to analyze usage.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="space-y-3">
              {stats.map((stat) => (
                <Item key={stat.method} variant="outline" className="flex-col gap-3">
                  <ItemMedia variant="icon">
                    <span className="text-lg">{getMethodIcon(stat.method)}</span>
                  </ItemMedia>
                  <ItemContent>
                    <ItemGroup className="gap-2">
                      <Item variant="muted">
                        <ItemContent>
                          <ItemTitle>{formatMethodName(stat.method)}</ItemTitle>
                          <ItemDescription>
                            {stat.count.toLocaleString()} transactions · Last used {formatDate(stat.lastUsed)}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Badge variant="outline">{stat.percentage.toFixed(1)}%</Badge>
                        </ItemActions>
                      </Item>
                    </ItemGroup>
                    <Progress value={stat.percentage} className="mt-2 h-2" />
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      {stats.length > 0 ? (
        <CardFooter className="flex items-center justify-between px-6 pb-6 pt-0 text-sm text-muted-foreground">
          <span>Total Transactions: {totalTransactions.toLocaleString()}</span>
          <span>Methods Available: {stats.length}</span>
        </CardFooter>
      ) : null}
    </Card>
  )
}
