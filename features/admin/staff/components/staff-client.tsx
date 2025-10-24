'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  StaffDashboardData,
  StaffPerformanceBenchmark,
  StaffWithMetrics,
} from '@/features/admin/staff/api/queries'
import { StaffStats } from './staff-stats'
import { StaffFilters, type RiskFilter } from './staff-filters'
import { StaffTable } from './staff-table'
import { StaffRiskBadge } from './staff-risk-badge'
import type { BackgroundStatus } from '@/features/admin/staff/api/internal/staff-dashboard/metrics'

function InsightList({ title, description, items }: { title: string; description: string; items: StaffWithMetrics[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground text-xs">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-xs">No records</p>
        ) : (
          items.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.fullName || item.title || 'Staff member'}</p>
                <p className="text-xs text-muted-foreground truncate">{item.salonName || '—'}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StaffRiskBadge staff={item} />
                <p className="text-xs text-muted-foreground">Score {item.compliance.score}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function TopPerformerList({ items }: { items: StaffPerformanceBenchmark[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top performers</CardTitle>
        <p className="text-sm text-muted-foreground text-xs">Sorted by customer rating and compliance</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-xs">No performers yet</p>
        ) : (
          items.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.name || 'Staff member'}</p>
                <p className="text-xs text-muted-foreground truncate">{item.salonName || '—'}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Rating {item.averageRating ? item.averageRating.toFixed(2) : '—'}</p>
                <p>Compliance {item.complianceScore}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export function StaffClient({ staff, stats, highRiskStaff, verificationQueue, topPerformers }: StaffDashboardData) {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [backgroundFilter, setBackgroundFilter] = useState<BackgroundStatus | 'all'>('all')

  const roleOptions = useMemo(() => {
    const roles = new Set<string>()
    staff.forEach((member) => {
      if (member.staffRole) roles.add(member.staffRole)
    })
    return Array.from(roles).sort()
  }, [staff])

  const filteredStaff = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    return staff
      .filter((member) => {
        if (riskFilter !== 'all' && member.compliance.riskLabel !== riskFilter) {
          return false
        }
        if (roleFilter !== 'all' && member.staffRole !== roleFilter) {
          return false
        }
        if (backgroundFilter !== 'all' && member.background.status !== backgroundFilter) {
          return false
        }

        if (!normalizedQuery) return true

        const searchTarget = [
          member.fullName,
          member.title,
          member.salonName,
          member.salonSlug,
          member.userId,
        ]
          .filter(Boolean)
          .map((value) => value!.toString().toLowerCase())

        return searchTarget.some((target) => target.includes(normalizedQuery))
      })
      .sort((a, b) => b.compliance.score - a.compliance.score)
  }, [staff, search, riskFilter, roleFilter, backgroundFilter])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-base font-semibold">Staff Oversight</p>
          <p className="text-sm text-muted-foreground">
            Monitor staff verification status, performance, and compliance issues across the platform.
          </p>
        </div>
        <StaffStats stats={stats} />
      </div>

      <StaffFilters
        search={search}
        onSearchChange={setSearch}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        backgroundFilter={backgroundFilter}
        onBackgroundFilterChange={setBackgroundFilter}
        roleOptions={roleOptions}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <InsightList
          title="High-risk compliance"
          description="Staff requiring immediate attention"
          items={highRiskStaff}
        />
        <InsightList
          title="Verification queue"
          description="Background checks pending or missing"
          items={verificationQueue}
        />
        <TopPerformerList items={topPerformers} />
      </div>

      <StaffTable staff={filteredStaff} />
    </div>
  )
}
