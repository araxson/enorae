'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Star, Trophy, Gift, TrendingUp, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LoyaltyPoints, LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'

type Props = {
  points: LoyaltyPoints | null
  transactions: LoyaltyTransaction[]
}

export function LoyaltyDashboard({ points, transactions }: Props) {
  const tierProgress = points ? (points.total_points / points.next_tier_points) * 100 : 0

  const getTierBadge = (tier: string) => {
    const variants = {
      bronze: 'secondary' as const,
      silver: 'default' as const,
      gold: 'default' as const,
      platinum: 'default' as const,
    }
    return variants[tier as keyof typeof variants] || 'secondary'
  }

  const formatPoints = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Total points</CardDescription>
              <Star className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>{formatPoints(points?.total_points || 0)}</CardTitle>
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
            <CardTitle>{points?.tier?.toUpperCase() || 'BRONZE'}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0">
            <Badge variant={getTierBadge(points?.tier || 'bronze')}>{points?.tier?.toUpperCase() || 'BRONZE'}</Badge>
            <CardDescription>Member tier</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>Lifetime earned</CardDescription>
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>{formatPoints(points?.points_earned || 0)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription>Total points earned</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Progress value={tierProgress} className="h-3" />
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span className="text-foreground">{formatPoints(points?.total_points || 0)} points</span>
              <span>
                {formatPoints(points?.next_tier_points || 0)} needed
              </span>
            </div>
            <CardDescription>
              Earn {formatPoints((points?.next_tier_points || 0) - (points?.total_points || 0))} more points to reach the next tier
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center justify-between">
            <CardTitle>Redeem Rewards</CardTitle>
            <Gift className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>$10 Off</CardTitle>
                <CardDescription>Redeem for 500 points</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 500}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>$25 Off</CardTitle>
                <CardDescription>Redeem for 1,000 points</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 1000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Free Service</CardTitle>
                <CardDescription>Redeem for 2,000 points</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 2000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>VIP Upgrade</CardTitle>
                <CardDescription>Redeem for 5,000 points</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 5000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <History className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {transactions.length === 0 ? (
              <div className="py-8 text-center">
                <CardDescription>No activity yet</CardDescription>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex gap-4 items-center justify-between border-b pb-3">
                  <div>
                    <div className="text-foreground">{transaction.description}</div>
                    <CardDescription>
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge variant={transaction.type === 'earned' ? 'default' : 'secondary'}>
                    {transaction.type === 'earned' ? '+' : '-'}{formatPoints(Math.abs(transaction.points))}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
