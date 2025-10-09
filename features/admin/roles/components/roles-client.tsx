'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { RolesStats } from './roles-stats'
import { RolesFilters } from './roles-filters'
import { RolesTable } from './roles-table'
import { AssignRoleForm } from './assign-role-form'
import type { UserRole } from '@/lib/types/app.types'

type RolesClientProps = {
  roles: UserRole[]
  stats: Record<string, { total: number; active: number; inactive: number }>
  salons: Array<{ id: string; name: string }>
  canDelete: boolean
}

export function RolesClient({ roles, stats, salons, canDelete }: RolesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false)

  const filteredRoles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return roles.filter((role) => {
      const matchesSearch =
        !normalizedQuery ||
        role.user_id?.toLowerCase().includes(normalizedQuery) ||
        role.salon_id?.toLowerCase().includes(normalizedQuery) ||
        role.permissions?.some((permission) =>
          permission.toLowerCase().includes(normalizedQuery)
        )

      const matchesRole = roleFilter === 'all' || role.role === roleFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && role.is_active) ||
        (statusFilter === 'inactive' && !role.is_active)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [roles, searchQuery, roleFilter, statusFilter])

  return (
    <Stack gap="xl">
      <Flex align="center" justify="between">
        <Box>
          <P className="text-base font-semibold">Role Management</P>
          <Muted className="mt-1">
            Assign and manage user roles across the platform
          </Muted>
        </Box>
        <Button onClick={() => setIsAssignFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </Flex>

      <RolesStats stats={stats} />

      <RolesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <RolesTable roles={filteredRoles} canDelete={canDelete} />

      <AssignRoleForm
        open={isAssignFormOpen}
        onOpenChange={setIsAssignFormOpen}
        salons={salons}
      />
    </Stack>
  )
}
