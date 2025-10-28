'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { TimeOffBalance } from '@/features/staff/time-off/api/queries'

interface BalanceTabProps {
  balance: TimeOffBalance
}

export function BalanceTab({ balance }: BalanceTabProps) {
  const usagePercent = (balance.used_days / balance.total_days) * 100
  const pendingPercent = (balance.pending_days / balance.total_days) * 100

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Time Off Balance ({balance.year})</CardTitle>
          <CardDescription>Your annual time off allocation and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ItemGroup className="grid grid-cols-3 gap-4 text-center">
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>{balance.total_days}</ItemTitle>
                  <ItemDescription>Total</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>
                    <span className="text-secondary">{balance.used_days}</span>
                  </ItemTitle>
                  <ItemDescription>Used</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>
                    <span className="text-primary">{balance.remaining_days}</span>
                  </ItemTitle>
                  <ItemDescription>Remaining</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
            <div className="space-y-2">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <ItemDescription>Used: {balance.used_days} days</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <div className="text-muted-foreground text-sm font-medium">
                      {usagePercent.toFixed(0)}%
                    </div>
                  </ItemActions>
                </Item>
              </ItemGroup>
              <Progress value={usagePercent} className="h-2" />
            </div>
            {balance.pending_days > 0 && (
              <div className="space-y-2">
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemDescription>Pending approval: {balance.pending_days} days</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <div className="text-muted-foreground text-sm font-medium">
                        {pendingPercent.toFixed(0)}%
                      </div>
                    </ItemActions>
                  </Item>
                </ItemGroup>
                <Progress value={pendingPercent} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
