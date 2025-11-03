'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import type { LoyaltyPoints, LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { LoyaltyStatsCards } from './loyalty-stats-cards'
import { LoyaltyTierProgress } from './loyalty-tier-progress'
import { LoyaltyActivityList } from './loyalty-activity-list'

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

  return (
    <div className="flex flex-col gap-6">
      <LoyaltyStatsCards points={points} formatNumber={formatNumber} />
      <LoyaltyTierProgress points={points} formatNumber={formatNumber} />
      <LoyaltyActivityList transactions={transactions} formatNumber={formatNumber} />
    </div>
  )
}
