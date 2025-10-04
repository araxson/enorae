'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { RolesStats } from './roles-stats'
import { RolesFilters } from './roles-filters'
import { RolesTable } from './roles-table'
import { AssignRoleForm } from './assign-role-form'

type RoleAssignment = {
  id: string | null
  user_id: string | null
  user_name?: string | null
  user_email?: string | null
  role: string | null
  salon_id?: string | null
  salon_name?: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at?: string | null
  permissions?: string[] | null
}

type RolesClientProps = {
  roles: RoleAssignment[]
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
    return roles.filter((role) => {
      const matchesSearch =
        !searchQuery ||
        role.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.user_email?.toLowerCase().includes(searchQuery.toLowerCase())

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
          <H1>Role Management</H1>
          <P className="text-muted-foreground mt-1">
            Assign and manage user roles across the platform
          </P>
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
