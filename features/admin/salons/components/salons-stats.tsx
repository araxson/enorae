'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Flex } from '@/components/layout'
import { P } from '@/components/ui/typography'
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
      tone: 'text-blue-500',
    },
    {
      label: 'Verified',
      value: stats.verified,
      icon: CheckCircle,
      tone: 'text-emerald-500',
    },
    {
      label: 'Expiring licenses',
      value: stats.expiringLicenses,
      icon: ShieldAlert,
      tone: 'text-amber-500',
    },
    {
      label: 'High risk',
      value: stats.highRisk,
      icon: ShieldAlert,
      tone: 'text-red-500',
    },
  ] as const

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {summaryCards.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label}>
          <CardContent className="p-4">
            <Flex justify="between" align="center">
              <div>
                <P className="text-sm text-muted-foreground">{label}</P>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
              <Icon className={`h-4 w-4 ${tone}`} />
            </Flex>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <Flex justify="between" align="center">
            <div>
              <P className="text-sm text-muted-foreground">Average compliance</P>
              <p className="text-2xl font-semibold">{stats.averageCompliance}%</p>
            </div>
            <Gauge className="h-4 w-4 text-purple-500" />
          </Flex>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
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
      <P className="text-sm text-muted-foreground mb-2">{title}</P>
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="capitalize">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
