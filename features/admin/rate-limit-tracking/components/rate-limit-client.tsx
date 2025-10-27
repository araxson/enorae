'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RateLimitTable } from './rate-limit-table'
import type { RateLimitSnapshot } from '@/features/admin/rate-limit-tracking/types'
import { ButtonGroup } from '@/components/ui/button-group'

interface RateLimitClientProps {
  snapshot: RateLimitSnapshot
}

export function RateLimitClient({ snapshot }: RateLimitClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredRecords =
    selectedStatus === null
      ? snapshot.records
      : snapshot.records.filter((r) => r.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">Active rate limit entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Currently Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{snapshot.blockedCount}</div>
            <p className="text-xs text-muted-foreground">Identifiers at limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{snapshot.warningCount}</div>
            <p className="text-xs text-muted-foreground">Approaching limit</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limit Tracking</CardTitle>
          <CardDescription>
            Monitor rate limit status across identifiers and endpoints
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
