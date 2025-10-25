'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Trophy, TrendingUp, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LoyaltyPoints, LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'

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
        <CardHeader>
          <CardTitle>Loyalty coming soon</CardTitle>
          <CardDescription>
            We&apos;ll let you know when loyalty rewards are ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Check back for updates or enable notifications in your profile settings.
          </CardDescription>
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
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Total points</CardDescription>
              <Star className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>{formatNumber(points.total_points)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Available to redeem</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Current tier</CardDescription>
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>{points.tier.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Member tier</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Lifetime earned</CardDescription>
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>{formatNumber(points.points_earned)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Total points earned</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress to next tier</CardTitle>
          <CardDescription>Keep booking appointments to unlock new rewards.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Progress value={tierProgress} className="h-3" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardDescription>{formatNumber(points.total_points)} points earned</CardDescription>
            <CardDescription>{formatNumber(points.next_tier_points)} needed</CardDescription>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Recent activity</CardTitle>
            <History className="h-5 w-5" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <CardDescription>No loyalty activity yet.</CardDescription>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <CardDescription>{transaction.description}</CardDescription>
                    <CardDescription>
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge>
                    {transaction.type === 'earned' ? '+' : '-'}
                    {formatNumber(Math.abs(transaction.points))}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
