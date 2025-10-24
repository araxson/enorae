'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SecurityAccessTable } from './security-access-table'
import type { SecurityAccessSnapshot } from '@/features/admin/security-access-monitoring/api/queries'

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
            <CardTitle className="text-sm font-medium">Total Access Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">All recorded access attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{snapshot.blockedCount}</div>
            <p className="text-xs text-muted-foreground">Failed or blocked attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{snapshot.flaggedCount}</div>
            <p className="text-xs text-muted-foreground">Suspicious activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{snapshot.pendingCount}</div>
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
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setSelectedStatus(null)}
              className={`px-3 py-1 rounded text-sm ${
                selectedStatus === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('blocked')}
              className={`px-3 py-1 rounded text-sm ${
                selectedStatus === 'blocked'
                  ? 'bg-red-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Blocked
            </button>
            <button
              onClick={() => setSelectedStatus('flagged')}
              className={`px-3 py-1 rounded text-sm ${
                selectedStatus === 'flagged'
                  ? 'bg-orange-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Flagged
            </button>
          </div>
          <SecurityAccessTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
