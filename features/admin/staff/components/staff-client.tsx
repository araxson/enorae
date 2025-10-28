'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  BackgroundStatus,
  StaffDashboardData,
  StaffPerformanceBenchmark,
  StaffWithMetrics,
} from '@/features/admin/staff/api/queries'
import { StaffFilters, type RiskFilter } from './staff-filters'
import { StaffRiskBadge } from './staff-risk-badge'
import { StaffStats } from './staff-stats'
import { StaffTable } from './staff-table'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

function InsightList({ title, description, items }: { title: string; description: string; items: StaffWithMetrics[] }) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No staff records</EmptyTitle>
                <EmptyDescription>
                  Metrics show up once team members match this condition.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2">
              <ItemGroup>
                {items.slice(0, 5).map((item) => (
                  <Item key={item.id} variant="outline" size="sm">
                    <ItemContent>
                      <div className="min-w-0">
                        <ItemTitle>
                          <span className="truncate">
                            {item.fullName || item.title || 'Staff member'}
                          </span>
                        </ItemTitle>
                        <ItemDescription>
                          <span className="truncate">{item.salonName || '—'}</span>
                        </ItemDescription>
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                        <StaffRiskBadge staff={item} />
                        <span>Score {item.compliance.score}</span>
                      </div>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TopPerformerList({ items }: { items: StaffPerformanceBenchmark[] }) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Top performers</CardTitle>
              <p className="text-xs text-muted-foreground">Sorted by customer rating and compliance</p>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No performers yet</EmptyTitle>
                <EmptyDescription>
                  Top performers populate after ratings and compliance scores stabilize.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2">
              <ItemGroup>
                {items.slice(0, 5).map((item) => (
                  <Item key={item.id} variant="outline" size="sm">
                    <ItemContent>
                      <div className="min-w-0">
                        <ItemTitle>
                          <span className="truncate">{item.name || 'Staff member'}</span>
                        </ItemTitle>
                        <ItemDescription>
                          <span className="truncate">{item.salonName || '—'}</span>
                        </ItemDescription>
                      </div>
                    </ItemContent>
                    <ItemActions>
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                        <span>
                          Rating {item.averageRating ? item.averageRating.toFixed(2) : '—'}
                        </span>
                        <span>Compliance {item.complianceScore}</span>
                      </div>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </div>
          )}
        </div>
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
