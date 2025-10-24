'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalCount}</div>
            <p className="text-xs text-muted-foreground">Active user sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{snapshot.criticalCount}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{snapshot.highRiskCount}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{snapshot.mfaEnabledCount}</div>
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
            <button
              onClick={() => setSelectedRisk(null)}
              className={`px-3 py-1 rounded text-sm ${
                selectedRisk === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRisk('critical')}
              className={`px-3 py-1 rounded text-sm ${
                selectedRisk === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedRisk('high')}
              className={`px-3 py-1 rounded text-sm ${
                selectedRisk === 'high'
                  ? 'bg-orange-600 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              High
            </button>
          </div>
          <SessionSecurityTable records={filteredRecords} />
        </CardContent>
      </Card>
    </div>
  )
}
