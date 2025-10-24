'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RateLimitTable } from './rate-limit-table'
import type { RateLimitSnapshot } from '@/features/admin/rate-limit-tracking/api/queries'

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
            <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">Active rate limit entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{snapshot.blockedCount}</div>
            <p className="text-xs text-muted-foreground">Identifiers at limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{snapshot.warningCount}</div>
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
              onClick={() => setSelectedStatus('warning')}
              className={`px-3 py-1 rounded text-sm ${
                selectedStatus === 'warning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Warnings
            </button>
          </div>
          <RateLimitTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
