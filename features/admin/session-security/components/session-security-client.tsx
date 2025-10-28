'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { SessionSecuritySnapshot } from '@/features/admin/session-security/api/queries'
import { ActivitySquare, ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ActivitySquare className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Total Sessions</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.totalCount}</CardTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>Active user sessions</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ShieldX className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Critical Risk</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.criticalCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="destructive">Critical</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Require immediate action</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>High Risk</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.highRiskCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="outline">High risk</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Monitor closely</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>MFA Enabled</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.mfaEnabledCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">MFA</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Protected sessions</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
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
          <ButtonGroup className="mb-4">
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
