'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Gift, Check, MessageSquare, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Referral } from '@/features/customer/referrals/api/queries'

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
        <CardHeader>
          <CardTitle>Referrals coming soon</CardTitle>
          <CardDescription>
            Invite rewards aren&apos;t available yet. We&apos;ll notify you once referrals launch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Keep an eye on announcements for the referral program rollout.
          </CardDescription>
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
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>{metric.title}</CardDescription>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Referral history</CardTitle>
            <History className="h-5 w-5" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <CardDescription>No referrals recorded yet.</CardDescription>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <CardDescription>Code: {referral.code}</CardDescription>
                    <CardDescription>
                      {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                    {referral.status === 'completed' ? 'Completed' : 'Pending'}
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
