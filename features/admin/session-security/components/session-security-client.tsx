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
import type { SessionSecuritySnapshot } from '@/features/admin/session-security/api/queries'
import { ActivitySquare, ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react'
import { AdminMetricCard } from '@/features/admin/common/components'
import { SessionSecurityTable } from './session-security-table'

interface SessionSecurityClientProps {
  snapshot: SessionSecuritySnapshot
}

export function SessionSecurityClient({ snapshot }: SessionSecurityClientProps) {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  const filteredRecords =
    selectedRisk === null
      ? snapshot.records
      : snapshot.records.filter((r) => r.risk_level === selectedRisk)

  const summaryCards = [
    {
      key: 'total',
      icon: ActivitySquare,
      title: 'Total Sessions',
      value: snapshot.totalCount.toLocaleString(),
      helper: 'Active user sessions',
    },
    {
      key: 'critical',
      icon: ShieldX,
      title: 'Critical Risk',
      value: snapshot.criticalCount.toLocaleString(),
      valueAdornment: <Badge variant="destructive">Critical</Badge>,
      helper: 'Require immediate action',
    },
    {
      key: 'high',
      icon: TriangleAlert,
      title: 'High Risk',
      value: snapshot.highRiskCount.toLocaleString(),
      valueAdornment: <Badge variant="outline">High risk</Badge>,
      helper: 'Monitor closely',
    },
    {
      key: 'mfa',
      icon: ShieldCheck,
      title: 'MFA Enabled',
      value: snapshot.mfaEnabledCount.toLocaleString(),
      valueAdornment: <Badge variant="secondary">MFA</Badge>,
      helper: 'Protected sessions',
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
                <ItemTitle>Session Security Monitoring</ItemTitle>
                <ItemDescription>
                  Monitor session risk scores and manage MFA requirements
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ButtonGroup aria-label="Filter by risk level">
            <Button
              onClick={() => setSelectedRisk(null)}
              size="sm"
              variant={selectedRisk === null ? 'default' : 'secondary'}
            >
              All
            </Button>
            <Button
              onClick={() => setSelectedRisk('critical')}
              size="sm"
              variant={selectedRisk === 'critical' ? 'destructive' : 'secondary'}
            >
              Critical
            </Button>
            <Button
              onClick={() => setSelectedRisk('high')}
              size="sm"
              variant={selectedRisk === 'high' ? 'default' : 'secondary'}
            >
              High
            </Button>
          </ButtonGroup>
          <SessionSecurityTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
