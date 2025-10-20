'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Stack, Grid, Flex } from '@/components/layout'
import { Star, Trophy, Gift, TrendingUp, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { LoyaltyPoints, LoyaltyTransaction } from '../api/queries'

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
    <Stack gap="xl">
      <Grid cols={{ base: 1, md: 3 }} gap="lg">
        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Total Points</CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatPoints(points?.total_points || 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Available to redeem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Current Tier</CardTitle>
              <Trophy className="h-5 w-5 text-purple-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <Badge variant={getTierBadge(points?.tier || 'bronze')} className="text-lg px-3 py-1">
              {points?.tier?.toUpperCase() || 'BRONZE'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Member tier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Lifetime Earned</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatPoints(points?.points_earned || 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Total points earned
            </p>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            <Progress value={tierProgress} className="h-3" />
            <Flex justify="between" className="text-sm">
              <span>{formatPoints(points?.total_points || 0)} points</span>
              <span className="text-muted-foreground">
                {formatPoints(points?.next_tier_points || 0)} needed
              </span>
            </Flex>
            <p className="text-sm text-muted-foreground">
              Earn {formatPoints((points?.next_tier_points || 0) - (points?.total_points || 0))} more points to reach the next tier
            </p>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>Redeem Rewards</CardTitle>
            <Gift className="h-5 w-5" />
          </Flex>
        </CardHeader>
        <CardContent>
          <Grid cols={{ base: 1, md: 2 }} gap="md">
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold">$10 Off</h4>
                <p className="text-sm text-muted-foreground my-2">500 points</p>
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 500}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold">$25 Off</h4>
                <p className="text-sm text-muted-foreground my-2">1,000 points</p>
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 1000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold">Free Service</h4>
                <p className="text-sm text-muted-foreground my-2">2,000 points</p>
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 2000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold">VIP Upgrade</h4>
                <p className="text-sm text-muted-foreground my-2">5,000 points</p>
                <Button size="sm" className="w-full" disabled={!points || points.total_points < 5000}>
                  Redeem
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Flex justify="between" align="center">
            <CardTitle>Recent Activity</CardTitle>
            <History className="h-5 w-5" />
          </Flex>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No activity yet</p>
            ) : (
              transactions.map((transaction) => (
                <Flex key={transaction.id} justify="between" align="center" className="border-b pb-3">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={transaction.type === 'earned' ? 'default' : 'secondary'}>
                    {transaction.type === 'earned' ? '+' : '-'}{formatPoints(Math.abs(transaction.points))}
                  </Badge>
                </Flex>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
