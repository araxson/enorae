'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { RateLimitRulesSnapshot } from '@/features/admin/rate-limit-rules/api/queries'
import { Activity, Shield, Zap } from 'lucide-react'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { RateLimitRulesTable } from './rate-limit-rules-table'

interface RateLimitRulesClientProps {
  snapshot: RateLimitRulesSnapshot
}

export function RateLimitRulesClient({ snapshot }: RateLimitRulesClientProps) {
  const summaryCards = [
    {
      key: 'total',
      icon: Shield,
      title: 'Total Rules',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Rate limit policies',
    },
    {
      key: 'active',
      icon: Activity,
      title: 'Active',
      value: snapshot.activeCount.toLocaleString(),
      valueAdornment: <Badge variant="secondary">Active</Badge>,
      helper: 'Enforced policies',
    },
    {
      key: 'violations',
      icon: Zap,
      title: 'Violations Today',
      value: snapshot.violationsTodayCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">Violations</Badge>,
      helper: 'Rate limit hits',
    },
  ] as const

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(({ key, icon, ...card }) => {
          const Icon = icon
          return (
            <AdminMetricCard
              key={key}
              icon={<Icon className="size-5" aria-hidden="true" />}
              {...card}
            />
          )
        })}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Policy Enforcement Overview</ItemTitle>
                <ItemDescription>
                  Manage rate limiting rules and review enforcement status
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <RateLimitRulesTable rules={snapshot.rules} />
        </CardContent>
      </Card>
    </div>
  )
}
