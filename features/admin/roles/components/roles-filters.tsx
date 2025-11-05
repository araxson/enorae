'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { SearchFilter, GenericFilter } from '@/features/shared/ui/components/filters'

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
      <SearchFilter
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by user or salon ID..."
        label="Search directory"
        inputId="roles-search"
        className="flex-1 min-w-0"
      />

      <GenericFilter
        value={roleFilter}
        onChange={onRoleFilterChange}
        options={[
          { label: 'Super Admin', value: 'super_admin' },
          { label: 'Platform Admin', value: 'platform_admin' },
          { label: 'Tenant Owner', value: 'tenant_owner' },
          { label: 'Salon Owner', value: 'salon_owner' },
          { label: 'Salon Manager', value: 'salon_manager' },
          { label: 'Senior Staff', value: 'senior_staff' },
          { label: 'Staff', value: 'staff' },
          { label: 'Junior Staff', value: 'junior_staff' },
          { label: 'Customer', value: 'customer' },
          { label: 'VIP Customer', value: 'vip_customer' },
          { label: 'Guest', value: 'guest' },
        ]}
        label="Role"
        placeholder="All Roles"
        showAll={true}
        allLabel="All Roles"
        className="w-44"
      />

      <GenericFilter
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        label="Status"
        placeholder="All Status"
        showAll={true}
        allLabel="All Status"
        className="w-36"
      />

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all filters
      </Button>
    </FieldGroup>
  )
}
