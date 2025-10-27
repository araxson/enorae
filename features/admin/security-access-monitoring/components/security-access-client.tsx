'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SecurityAccessTable } from './security-access-table'
import type { SecurityAccessSnapshot } from '@/features/admin/security-access-monitoring/api/queries'
import { ButtonGroup } from '@/components/ui/button-group'

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Access Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">All recorded access attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Blocked Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{snapshot.blockedCount}</div>
            <p className="text-xs text-muted-foreground">Failed or blocked attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Flagged Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{snapshot.flaggedCount}</div>
            <p className="text-xs text-muted-foreground">Suspicious activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{snapshot.pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting acknowledgement</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Security Access Monitoring</CardTitle>
          <CardDescription>
            Real-time monitoring of all access attempts to the platform
          </CardDescription>
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
