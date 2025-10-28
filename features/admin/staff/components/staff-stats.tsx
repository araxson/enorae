'use client'

import { ShieldCheck, AlertTriangle, ClipboardCheck, Users, TrendingUp, Gauge } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { StaffDashboardStats } from '@/features/admin/staff/api/queries'

const STAT_ICON_CLASSES = 'size-4'

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
    <ItemGroup className="grid gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <Item key={card.label} variant="outline" className="flex-col items-start gap-3">
            <ItemContent className="w-full gap-2">
              <div className="flex items-center justify-between gap-3">
                <ItemTitle>{card.label}</ItemTitle>
                <Icon className={`${STAT_ICON_CLASSES} ${card.tone}`} />
              </div>
              <ItemDescription>Staff readiness indicator.</ItemDescription>
              <span className="text-3xl font-semibold text-foreground">{card.value}</span>
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
