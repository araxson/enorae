'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Search, X } from 'lucide-react'
import type { BackgroundStatus } from '@/features/admin/staff/api/dashboard/metrics'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

declare global {
  interface WindowEventMap {
    'admin:clearFilters': CustomEvent<void>
  }
}

export type RiskFilter = 'all' | 'low' | 'medium' | 'high'

const riskFilterValues: readonly RiskFilter[] = ['all', 'low', 'medium', 'high'] as const
const isRiskFilter = (value: string): value is RiskFilter => riskFilterValues.some((option) => option === value)

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
  const clearFilters = () => {
    onSearchChange('')
    onRiskFilterChange('all')
    onRoleFilterChange('all')
    onBackgroundFilterChange('all')
  }

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => {
      window.removeEventListener('admin:clearFilters', handleClear)
    }
  }, [onSearchChange, onRiskFilterChange, onRoleFilterChange, onBackgroundFilterChange])

  return (
    <Card>
      <CardHeader>
        <ItemGroup className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Item variant="muted">
            <ItemContent>
              <CardTitle>Filters</CardTitle>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemActions>
              <ButtonGroup>
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </ButtonGroup>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="staff-search">Search</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="staff-search"
                    placeholder="Search by staff, salon or email"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    {search ? (
                      <InputGroupButton
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Clear search"
                        onClick={() => onSearchChange('')}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </InputGroupButton>
                    ) : null}
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Compliance risk</FieldLabel>
              <FieldContent>
                <Select
                  value={riskFilter}
                  onValueChange={(value) => {
                    if (isRiskFilter(value)) {
                      onRiskFilterChange(value)
                    }
                  }}
                >
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
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>
              <FieldContent>
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
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Background check</FieldLabel>
              <FieldContent>
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
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      </CardContent>
    </Card>
  )
}
