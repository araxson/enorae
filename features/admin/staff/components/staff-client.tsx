'use client'

import { useMemo, useState } from 'react'
import type {
  BackgroundStatus,
  StaffDashboardData,
  StaffWithMetrics,
} from '@/features/admin/staff/api/queries'
import { StaffFilters, type RiskFilter } from './staff-filters'
import { StaffStats } from './staff-stats'
import { StaffTable } from './staff-table'
import { StaffInsightList } from './staff-insight-list'
import { StaffTopPerformers } from './staff-top-performers'
import { useStaffFilters } from './use-staff-filters'

export function StaffClient({ staff, stats, highRiskStaff, verificationQueue, topPerformers }: StaffDashboardData) {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [backgroundFilter, setBackgroundFilter] = useState<BackgroundStatus | 'all'>('all')

  const roleOptions = useMemo(() => {
    const roles = new Set<string>()
    staff.forEach((member: StaffWithMetrics) => {
      if (member.staffRole) roles.add(member.staffRole)
    })
    return Array.from(roles).sort()
  }, [staff])

  const filteredStaff = useStaffFilters(staff, search, riskFilter, roleFilter, backgroundFilter)

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
        <StaffInsightList
          title="High-risk compliance"
          description="Staff requiring immediate attention"
          items={highRiskStaff}
        />
        <StaffInsightList
          title="Verification queue"
          description="Background checks pending or missing"
          items={verificationQueue}
        />
        <StaffTopPerformers items={topPerformers} />
      </div>

      <StaffTable staff={filteredStaff} />
    </div>
  )
}
