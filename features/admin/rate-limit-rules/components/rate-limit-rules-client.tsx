'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RateLimitRulesTable } from './rate-limit-rules-table'
import type { RateLimitRulesSnapshot } from '@/features/admin/rate-limit-rules/api/queries'

interface RateLimitRulesClientProps {
  snapshot: RateLimitRulesSnapshot
}

export function RateLimitRulesClient({ snapshot }: RateLimitRulesClientProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">Rate limit policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{snapshot.activeCount}</div>
            <p className="text-xs text-muted-foreground">Enforced policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {snapshot.violationsTodayCount}
            </div>
            <p className="text-xs text-muted-foreground">Rate limit hits</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Enforcement Overview</CardTitle>
          <CardDescription>
            Manage rate limiting rules and review enforcement status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RateLimitRulesTable rules={snapshot.rules} />
        </CardContent>
      </Card>
    </div>
  )
}
