'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'
import { ShieldCheck, AlertTriangle, ClipboardCheck, Users, TrendingUp, Gauge } from 'lucide-react'
import type { StaffDashboardStats } from '../api/queries'

const STAT_ICON_CLASSES = 'h-4 w-4'

export function StaffStats({ stats }: { stats: StaffDashboardStats }) {
  const statCards = [
    {
      label: 'Total staff',
      value: stats.totalStaff,
      icon: Users,
      tone: 'text-blue-500',
    },
    {
      label: 'Background cleared',
      value: stats.verifiedStaff,
      icon: ShieldCheck,
      tone: 'text-emerald-500',
    },
    {
      label: 'Pending verification',
      value: stats.pendingReviews,
      icon: AlertTriangle,
      tone: 'text-amber-500',
    },
    {
      label: 'Critical alerts',
      value: stats.criticalAlerts,
      icon: ClipboardCheck,
      tone: 'text-red-500',
    },
    {
      label: 'Average experience',
      value: `${stats.averageExperience} yrs`,
      icon: TrendingUp,
      tone: 'text-purple-500',
    },
    {
      label: 'Avg compliance score',
      value: `${stats.averageCompliance}%`,
      icon: Gauge,
      tone: 'text-sky-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="p-4">
              <Flex justify="between" align="center">
                <div>
                  <P className="text-sm text-muted-foreground">{card.label}</P>
                  <p className="text-2xl font-semibold mt-1">{card.value}</p>
                </div>
                <Icon className={`${STAT_ICON_CLASSES} ${card.tone}`} />
              </Flex>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
