'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Flex } from '@/components/layout'

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
  return (
    <Flex gap="md" align="center" className="flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-[180px]">
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
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </Flex>
  )
}
