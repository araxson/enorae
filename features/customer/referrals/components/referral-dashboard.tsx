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
  ItemMedia,
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
  referralCode: Referral | null
  stats: {
    total_referrals: number
    successful_referrals: number
    pending_referrals: number
    total_bonus_points: number
  }
  history: Referral[]
}

const metrics = [
  { key: 'total_referrals', title: 'Total referrals', icon: Users },
  { key: 'successful_referrals', title: 'Successful', icon: Check },
  { key: 'pending_referrals', title: 'Pending', icon: MessageSquare },
  { key: 'total_bonus_points', title: 'Bonus points', icon: Gift },
] as const

export function ReferralDashboard({ referralCode, stats, history }: Props) {
  if (!referralCode) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyMedia variant="icon">
              <Users className="h-6 w-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
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
              <CardHeader className="gap-3">
                <ItemGroup>
                  <Item variant="muted" size="sm">
                    <ItemMedia variant="icon">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <CardDescription>{metric.title}</CardDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
                <CardTitle>{stats[metric.key]}</CardTitle>
              </CardHeader>
              <CardContent />
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
          <CardDescription>{referralCode.code}</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Referral history</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <History className="h-5 w-5" aria-hidden="true" />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <History className="h-6 w-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
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
                    <ItemActions className="flex-none">
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
