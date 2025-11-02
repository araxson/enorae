'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Gift, Check, MessageSquare, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Referral } from '@/features/customer/referrals/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type Props = {
  referralCode: string | null
  stats: {
    total_referrals: number
    successful_referrals: number
    pending_referrals: number
    total_bonus_points: number
  }
  history: Referral[]
}

const metrics = [
  {
    key: 'total_referrals',
    title: 'Total referrals',
    description: 'Friends invited',
    icon: Users,
  },
  {
    key: 'successful_referrals',
    title: 'Successful referrals',
    description: 'Completed signups',
    icon: Check,
  },
  {
    key: 'pending_referrals',
    title: 'Pending referrals',
    description: 'Awaiting responses',
    icon: MessageSquare,
  },
  {
    key: 'total_bonus_points',
    title: 'Bonus points',
    description: 'Rewards earned',
    icon: Gift,
  },
] as const

export function ReferralDashboard({ referralCode, stats, history }: Props) {
  if (!referralCode) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Referrals coming soon</EmptyTitle>
              <EmptyDescription>
                Invite rewards aren&apos;t available yet. We&apos;ll notify you once referrals
                launch.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              Keep an eye on announcements for the referral program rollout.
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.key}>
              <CardHeader>
                <CardTitle>{metric.title}</CardTitle>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold text-foreground">{stats[metric.key]}</p>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your referral code</CardTitle>
          <CardDescription>
            Share this code with friends once the referral program is live.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-lg font-semibold text-foreground">{referralCode}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral history</CardTitle>
          <CardDescription>Track invite activity as the program rolls out.</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <History className="size-6" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No referrals recorded yet</EmptyTitle>
                <EmptyDescription>
                  Share your code when the program launches to start earning rewards.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-2">
              {history.map((referral, index) => (
                <Fragment key={referral.id}>
                  <Item>
                    <ItemContent>
                      <ItemTitle>Code: {referral.code}</ItemTitle>
                      <ItemDescription>
                        {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                        {referral.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </ItemActions>
                  </Item>
                  {index < history.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
