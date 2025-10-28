'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Trophy, TrendingUp, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LoyaltyPoints, LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

type Props = {
  points: LoyaltyPoints | null
  transactions: LoyaltyTransaction[]
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function LoyaltyDashboard({ points, transactions }: Props) {
  if (!points) {
    return (
      <Card>
        <CardContent>
          <div className="p-6">
            <Empty>
              <EmptyMedia variant="icon">
                <Star className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Loyalty coming soon</EmptyTitle>
                <EmptyDescription>
                  We&apos;ll let you know when loyalty rewards are ready.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Check back for updates or enable notifications in your profile settings.
              </EmptyContent>
            </Empty>
          </div>
        </CardContent>
      </Card>
    )
  }

  const tierProgress =
    points.next_tier_points > 0
      ? (points.total_points / points.next_tier_points) * 100
      : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <CardDescription>Total points</CardDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <Star className="size-5" aria-hidden="true" />
                  </ItemActions>
                </Item>
              </ItemGroup>
              <CardTitle>{formatNumber(points.total_points)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="pt-0">
              <CardDescription>Available to redeem</CardDescription>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <CardDescription>Current tier</CardDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <Trophy className="size-5" aria-hidden="true" />
                  </ItemActions>
                </Item>
              </ItemGroup>
              <CardTitle>{points.tier.toUpperCase()}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="pt-0">
              <CardDescription>Member tier</CardDescription>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2">
              <ItemGroup>
                <Item>
                  <ItemContent>
                    <CardDescription>Lifetime earned</CardDescription>
                  </ItemContent>
                  <ItemActions className="flex-none">
                    <TrendingUp className="size-5" aria-hidden="true" />
                  </ItemActions>
                </Item>
              </ItemGroup>
              <CardTitle>{formatNumber(points.points_earned)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="pt-0">
              <CardDescription>Total points earned</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress to next tier</CardTitle>
          <CardDescription>Keep booking appointments to unlock new rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Progress value={tierProgress} className="h-3" />
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemDescription>{formatNumber(points.total_points)} points earned</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <ItemDescription>{formatNumber(points.next_tier_points)} needed</ItemDescription>
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Recent activity</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <History className="size-5" aria-hidden="true" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No loyalty activity yet</EmptyTitle>
                <EmptyDescription>Earn points by booking appointments or completing promotions.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-2">
              {transactions.map((transaction, index) => (
                <Fragment key={transaction.id}>
                  <Item>
                    <ItemContent>
                      <ItemTitle>{transaction.description}</ItemTitle>
                      <ItemDescription>
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <Badge>
                        {transaction.type === 'earned' ? '+' : '-'}
                        {formatNumber(Math.abs(transaction.points))}
                      </Badge>
                    </ItemActions>
                  </Item>
                  {index < transactions.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
