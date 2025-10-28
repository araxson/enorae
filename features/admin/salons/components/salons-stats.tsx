'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Building2, CheckCircle, Gauge, ShieldAlert } from 'lucide-react'

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
      description: 'Current platform count',
      icon: Building2,
      tone: 'text-primary',
    },
    {
      label: 'Verified',
      value: stats.verified,
      description: 'Fully verified salons',
      icon: CheckCircle,
      tone: 'text-primary',
    },
    {
      label: 'Expiring licenses',
      value: stats.expiringLicenses,
      description: 'Require renewal soon',
      icon: ShieldAlert,
      tone: 'text-accent',
    },
    {
      label: 'High risk',
      value: stats.highRisk,
      description: 'Compliance issues detected',
      icon: ShieldAlert,
      tone: 'text-destructive',
    },
  ] as const

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {summaryCards.map(({ label, value, description, icon: Icon, tone }) => (
        <Alert key={label} className="flex items-start gap-3">
          <ItemGroup className="flex-1 gap-2">
            <Item className="items-start gap-3">
              <ItemMedia variant="icon">
                <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
              </ItemMedia>
              <ItemContent className="flex flex-col gap-1">
                <AlertTitle>{label}</AlertTitle>
                <CardTitle>{value.toLocaleString()}</CardTitle>
                <AlertDescription>{description}</AlertDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </Alert>
      ))}

      <Alert className="flex items-start gap-3">
        <ItemGroup className="flex-1 gap-2">
          <Item className="items-start gap-3">
            <ItemMedia variant="icon">
              <Gauge className="h-5 w-5 text-secondary" aria-hidden="true" />
            </ItemMedia>
            <ItemContent className="flex flex-col gap-1">
              <AlertTitle>Average compliance</AlertTitle>
              <CardTitle>{stats.averageCompliance}%</CardTitle>
              <AlertDescription>License and policy adherence across salons</AlertDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </Alert>

      <Item variant="outline" className="flex-col gap-3 lg:col-span-3">
        <ItemHeader>
          <ItemTitle>Distribution</ItemTitle>
        </ItemHeader>
        <ItemContent className="grid gap-4 md:grid-cols-2">
          <Distribution title="By tier" data={stats.byTier} />
          <Distribution title="By type" data={stats.byType} />
        </ItemContent>
      </Item>
    </div>
  )
}

function Distribution({ title, data }: { title: string; data: Record<string, number> }) {
  return (
    <ItemGroup>
      <Item className="flex-col items-start gap-2">
        <ItemContent>
          <ItemDescription>{title}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex w-full flex-col gap-1">
          {Object.entries(data).map(([key, value]) => (
            <ItemGroup key={key}>
              <Item className="flex w-full items-center justify-between">
                <ItemContent>
                  <span className="capitalize">{key}</span>
                </ItemContent>
                <ItemContent className="flex-none">{value}</ItemContent>
              </Item>
            </ItemGroup>
          ))}
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
