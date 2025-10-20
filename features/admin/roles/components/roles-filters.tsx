'use client'

import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

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
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user or salon ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-44">
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

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all filters
      </Button>
    </div>
  )
}
