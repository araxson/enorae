'use client'

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
import type { BackgroundStatus } from '@/features/admin/staff/api/queries'
import { Item, ItemActions, ItemContent, ItemGroup } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import type { RiskFilter } from './staff-filters-types'

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
  onClearFilters: () => void
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
  onClearFilters,
}: StaffFiltersProps) {
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
                <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
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
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="staff-search"
                    type="search"
                    placeholder="Search by staff, salon or email"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search staff directory"
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    {search ? (
                      <InputGroupButton
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Clear search"
                        onClick={() => onSearchChange('')}
                      >
                        <X className="size-4" aria-hidden="true" />
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
