'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Stack } from '@/components/layout'
import type { BackgroundStatus } from '../utils/metrics'

export type RiskFilter = 'all' | 'low' | 'medium' | 'high'

type StaffFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  riskFilter: RiskFilter
  onRiskFilterChange: (value: RiskFilter) => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  backgroundFilter: BackgroundStatus | 'all'
  onBackgroundFilterChange: (value: BackgroundStatus | 'all') => void
  roleOptions: string[]
}

export function StaffFilters({
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  roleFilter,
  onRoleFilterChange,
  backgroundFilter,
  onBackgroundFilterChange,
  roleOptions,
}: StaffFiltersProps) {
  return (
    <div className="rounded-lg border p-4">
      <Stack gap="md">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="staff-search">Search</Label>
            <Input
              id="staff-search"
              placeholder="Search by staff, salon or email"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Compliance risk</Label>
            <Select value={riskFilter} onValueChange={(value) => onRiskFilterChange(value as RiskFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Background check</Label>
            <Select
              value={backgroundFilter}
              onValueChange={(value) => onBackgroundFilterChange(value as BackgroundStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Stack>
    </div>
  )
}
