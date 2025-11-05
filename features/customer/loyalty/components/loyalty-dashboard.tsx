'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import type { LoyaltyPoints, LoyaltyTransaction } from '@/features/customer/loyalty/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { LoyaltyStatsCards } from './loyalty-stats-cards'
import { LoyaltyTierProgress } from './loyalty-tier-progress'
import { LoyaltyActivityList } from './loyalty-activity-list'
import { Button } from '@/components/ui/button'

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
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Star className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Loyalty coming soon</EmptyTitle>
              <EmptyDescription>
                We&apos;ll let you know when loyalty rewards are ready.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/customer/notifications">Enable notifications</Link>
              </Button>
            </EmptyContent>
          </Empty>
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
