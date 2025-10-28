'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { RateLimitSnapshot } from '@/features/admin/rate-limit-tracking/types'
import { AlertTriangle, Gauge, ShieldX } from 'lucide-react'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { RateLimitTable } from './rate-limit-table'

interface RateLimitClientProps {
  snapshot: RateLimitSnapshot
}

export function RateLimitClient({ snapshot }: RateLimitClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredRecords =
    selectedStatus === null
      ? snapshot.records
      : snapshot.records.filter((r) => r.status === selectedStatus)

  const summaryCards = [
    {
      key: 'total',
      icon: Gauge,
      title: 'Total Tracked',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Active rate limit entries',
    },
    {
      key: 'blocked',
      icon: ShieldX,
      title: 'Currently Blocked',
      value: snapshot.blockedCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">Blocked</Badge>,
      helper: 'Identifiers at limit',
    },
    {
      key: 'warning',
      icon: AlertTriangle,
      title: 'Warnings',
      value: snapshot.warningCount.toLocaleString(),
      valueAdornment: <Badge variant="secondary">Warning</Badge>,
      helper: 'Approaching limit',
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
                <ItemTitle>Rate Limit Tracking</ItemTitle>
                <ItemDescription>
                  Monitor rate limit status across identifiers and endpoints
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ButtonGroup aria-label="Filter by status">
            <Button
              onClick={() => setSelectedStatus(null)}
              size="sm"
              variant={selectedStatus === null ? 'default' : 'secondary'}
            >
              All
            </Button>
            <Button
              onClick={() => setSelectedStatus('blocked')}
              size="sm"
              variant={selectedStatus === 'blocked' ? 'destructive' : 'secondary'}
            >
              Blocked
            </Button>
            <Button
              onClick={() => setSelectedStatus('warning')}
              size="sm"
              variant={selectedStatus === 'warning' ? 'default' : 'secondary'}
            >
              Warnings
            </Button>
          </ButtonGroup>
          <RateLimitTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
