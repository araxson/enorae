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
import type { SecurityAccessSnapshot } from '@/features/admin/security-access-monitoring/api/queries'
import { AlertOctagon, Bell, ShieldCheck, ShieldX } from 'lucide-react'
import { AdminMetricCard } from '@/features/admin/admin-common/components'
import { SecurityAccessTable } from './security-access-table'

interface SecurityAccessClientProps {
  snapshot: SecurityAccessSnapshot
}

export function SecurityAccessClient({ snapshot }: SecurityAccessClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredRecords =
    selectedStatus === null
      ? snapshot.records
      : snapshot.records.filter((r) => r.status === selectedStatus)

  const summaryCards = [
    {
      key: 'total',
      icon: ShieldCheck,
      title: 'Total Access Events',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'All recorded access attempts',
    },
    {
      key: 'blocked',
      icon: ShieldX,
      title: 'Blocked Access',
      value: snapshot.blockedCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">Blocked</Badge>,
      helper: 'Failed or blocked attempts',
    },
    {
      key: 'flagged',
      icon: AlertOctagon,
      title: 'Flagged Events',
      value: snapshot.flaggedCount.toLocaleString(),
      valueAdornment: <Badge variant="outline">Flagged</Badge>,
      helper: 'Suspicious activities',
    },
    {
      key: 'pending',
      icon: Bell,
      title: 'Pending Review',
      value: snapshot.pendingCount.toLocaleString(),
      valueAdornment: <Badge variant="secondary">Pending</Badge>,
      helper: 'Awaiting acknowledgement',
    },
  ] as const

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
                <ItemTitle>Security Access Monitoring</ItemTitle>
                <ItemDescription>
                  Real-time monitoring of all access attempts to the platform
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
              onClick={() => setSelectedStatus('flagged')}
              size="sm"
              variant={selectedStatus === 'flagged' ? 'default' : 'secondary'}
            >
              Flagged
            </Button>
          </ButtonGroup>
          <SecurityAccessTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
