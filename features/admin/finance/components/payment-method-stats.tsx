import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { PaymentMethodStats } from '@/features/admin/finance/api/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
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
    const methodLower = method.toLowerCase()
    if (methodLower.includes('card') || methodLower.includes('credit') || methodLower.includes('debit')) return '💳'
    if (methodLower.includes('cash')) return '💵'
    if (methodLower.includes('online') || methodLower.includes('digital')) return '📱'
    if (methodLower.includes('wallet')) return '👛'
    return '💰'
  }

  const totalTransactions = stats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Payment Method Statistics</ItemTitle>
        </ItemContent>
      </ItemHeader>
      <ItemContent>
        <div className="space-y-4">
          <ScrollArea className="px-6 pt-6">
          {stats.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No payment method data available</EmptyTitle>
                <EmptyDescription>Connect a processor or import transactions to analyze usage.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              <ItemGroup>
                {stats.map((stat) => (
                  <Item key={stat.method} variant="outline" size="sm">
                    <ItemMedia variant="icon">
                      <span className="text-lg">{getMethodIcon(stat.method)}</span>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{formatMethodName(stat.method)}</ItemTitle>
                      <ItemDescription>
                        {stat.count.toLocaleString()} transactions · Last used {formatDate(stat.lastUsed)}
                      </ItemDescription>
                      <div className="mt-2">
                        <Progress value={stat.percentage} />
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="outline">{stat.percentage.toFixed(1)}%</Badge>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        </div>
      </ItemContent>
      {stats.length > 0 ? (
        <ItemFooter>
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <span>Total Transactions: {totalTransactions.toLocaleString()}</span>
            <span>Methods Available: {stats.length}</span>
          </div>
        </ItemFooter>
      ) : null}
    </Item>
  )
}
