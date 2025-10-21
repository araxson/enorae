'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, AlertTriangle, ClipboardCheck, Users, TrendingUp, Gauge } from 'lucide-react'
import type { StaffDashboardStats } from '../api/queries'

const STAT_ICON_CLASSES = 'h-4 w-4'

export function StaffStats({ stats }: { stats: StaffDashboardStats }) {
  const statCards = [
    {
      label: 'Total staff',
      value: stats.totalStaff,
      icon: Users,
      tone: 'text-primary',
    },
    {
      label: 'Background cleared',
      value: stats.verifiedStaff,
      icon: ShieldCheck,
      tone: 'text-primary',
    },
    {
      label: 'Pending verification',
      value: stats.pendingReviews,
      icon: AlertTriangle,
      tone: 'text-accent',
    },
    {
      label: 'Critical alerts',
      value: stats.criticalAlerts,
      icon: ClipboardCheck,
      tone: 'text-destructive',
    },
    {
      label: 'Average experience',
      value: `${stats.averageExperience} yrs`,
      icon: TrendingUp,
      tone: 'text-secondary',
    },
    {
      label: 'Avg compliance score',
      value: `${stats.averageCompliance}%`,
      icon: Gauge,
      tone: 'text-primary',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="leading-7 text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-semibold mt-1">{card.value}</p>
                </div>
                <Icon className={`${STAT_ICON_CLASSES} ${card.tone}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
