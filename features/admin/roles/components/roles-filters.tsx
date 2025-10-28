'use client'

import { useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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

declare global {
  interface WindowEventMap {
    'admin:clearFilters': CustomEvent<void>
  }
}

type RolesFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function RolesFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: RolesFiltersProps) {
  const clearFilters = () => {
    onSearchChange('')
    onRoleFilterChange('all')
    onStatusFilterChange('all')
  }

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => window.removeEventListener('admin:clearFilters', handleClear)
  }, [onSearchChange, onRoleFilterChange, onStatusFilterChange])

  return (
    <FieldGroup className="flex flex-wrap items-center gap-6">
      <Field className="flex-1 min-w-0">
        <FieldLabel htmlFor="roles-search">Search directory</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="roles-search"
              type="search"
              placeholder="Search by user or salon ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search roles directory"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              {searchQuery ? (
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

      <Field className="w-44">
        <FieldLabel>Role</FieldLabel>
        <FieldContent>
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="platform_admin">Platform Admin</SelectItem>
              <SelectItem value="tenant_owner">Tenant Owner</SelectItem>
              <SelectItem value="salon_owner">Salon Owner</SelectItem>
              <SelectItem value="salon_manager">Salon Manager</SelectItem>
              <SelectItem value="senior_staff">Senior Staff</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="junior_staff">Junior Staff</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="vip_customer">VIP Customer</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field className="w-36">
        <FieldLabel>Status</FieldLabel>
        <FieldContent>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all filters
      </Button>
    </FieldGroup>
  )
}
