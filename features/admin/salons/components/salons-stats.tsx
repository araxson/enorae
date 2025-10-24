'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CheckCircle, ShieldAlert, Gauge } from 'lucide-react'

interface SalonsStatsProps {
  stats: {
    total: number
    active: number
    verified: number
    expiringLicenses: number
    highRisk: number
    averageCompliance: number
    byTier: Record<string, number>
    byType: Record<string, number>
  }
}

export function SalonsStats({ stats }: SalonsStatsProps) {
  const summaryCards = [
    {
      label: 'Total salons',
      value: stats.total,
      icon: Building2,
      tone: 'text-primary',
    },
    {
      label: 'Verified',
      value: stats.verified,
      icon: CheckCircle,
      tone: 'text-primary',
    },
    {
      label: 'Expiring licenses',
      value: stats.expiringLicenses,
      icon: ShieldAlert,
      tone: 'text-accent',
    },
    {
      label: 'High risk',
      value: stats.highRisk,
      icon: ShieldAlert,
      tone: 'text-destructive',
    },
  ] as const

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {summaryCards.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{label}</CardTitle>
              <Icon className={`h-4 w-4 ${tone}`} />
            </div>
            <CardDescription>Current platform count.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{value.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Average compliance</CardTitle>
            <Gauge className="h-4 w-4 text-secondary" />
          </div>
          <CardDescription>License and policy adherence across salons.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.averageCompliance}%</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>Breakdown by tier and operating model.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Distribution title="By tier" data={stats.byTier} />
          <Distribution title="By type" data={stats.byType} />
        </CardContent>
      </Card>
    </div>
  )
}

function Distribution({ title, data }: { title: string; data: Record<string, number> }) {
  return (
    <div>
      <p className="text-muted-foreground mb-2">{title}</p>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
