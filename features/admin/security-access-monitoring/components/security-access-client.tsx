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
import type { SecurityAccessSnapshot } from '@/features/admin/security-access-monitoring/api/queries'
import { AlertOctagon, Bell, ShieldCheck, ShieldX } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Total Access Events</ItemTitle>
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
                  <ItemDescription>All recorded access attempts</ItemDescription>
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
                  <ItemTitle>Blocked Access</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.blockedCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="destructive">Blocked</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Failed or blocked attempts</ItemDescription>
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
                  <AlertOctagon className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Flagged Events</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.flaggedCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="outline">Flagged</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Suspicious activities</ItemDescription>
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
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Pending Review</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item className="flex-col items-start gap-2">
                <ItemContent>
                  <CardTitle>{snapshot.pendingCount}</CardTitle>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">Pending</Badge>
                </ItemActions>
                <ItemContent>
                  <ItemDescription>Awaiting acknowledgement</ItemDescription>
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
                <ItemTitle>Security Access Monitoring</ItemTitle>
                <ItemDescription>
                  Real-time monitoring of all access attempts to the platform
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ButtonGroup className="mb-4">
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
