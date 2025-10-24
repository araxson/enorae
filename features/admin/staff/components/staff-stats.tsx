'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, AlertTriangle, ClipboardCheck, Users, TrendingUp, Gauge } from 'lucide-react'
import type { StaffDashboardStats } from '@/features/admin/staff/api/queries'

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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{card.label}</CardTitle>
                <Icon className={`${STAT_ICON_CLASSES} ${card.tone}`} />
              </div>
              <CardDescription>Staff readiness indicator.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
