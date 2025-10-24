'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SessionSecurityTable } from './session-security-table'
import type { SessionSecuritySnapshot } from '@/features/admin/session-security/api/queries'

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">Active user sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Critical Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{snapshot.criticalCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{snapshot.highRiskCount}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>MFA Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{snapshot.mfaEnabledCount}</div>
            <p className="text-xs text-muted-foreground">Protected sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Session Security Monitoring</CardTitle>
          <CardDescription>
            Monitor session risk scores and manage MFA requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
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
          </div>
          <SessionSecurityTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
