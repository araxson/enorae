'use client'

import { useState, useMemo } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RolesStats } from './roles-stats'
import { RolesFilters } from './roles-filters'
import { RolesTable } from './roles-table'
import { AssignRoleForm } from './assign-role-form'
import type { UserRole } from '@/lib/types'
import type { RoleAuditEvent } from '@/features/admin/roles/api/queries'
import { BulkAssignDialog } from './bulk-assign-dialog'
import { RolePermissionMatrix } from './role-permission-matrix'
import { RoleAuditTimeline } from './role-audit-timeline'
import { ButtonGroup } from '@/components/ui/button-group'

interface RolesClientProps {
  roles: UserRole[]
  stats: Record<string, { total: number; active: number; inactive: number }>
  salons: Array<{ id: string; name: string }>
  canDelete: boolean
  auditEvents: RoleAuditEvent[]
}

export function RolesClient({ roles, stats, salons, canDelete, auditEvents }: RolesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)

  const filteredRoles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return roles.filter((role) => {
      const matchesSearch =
        !normalizedQuery ||
        role['user_id']?.toLowerCase().includes(normalizedQuery) ||
        role['salon_id']?.toLowerCase().includes(normalizedQuery) ||
        role['permissions']?.some((permission) => permission.toLowerCase().includes(normalizedQuery))

      const matchesRole = roleFilter === 'all' || role['role'] === roleFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && role['is_active']) ||
        (statusFilter === 'inactive' && !role['is_active'])

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [roles, searchQuery, roleFilter, statusFilter])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-base font-semibold">Role Management</p>
          <p className="text-sm text-muted-foreground mt-1">
            Assign roles, manage permissions, and monitor historical changes.
          </p>
        </div>
        <ButtonGroup aria-label="Actions">
          <Button variant="outline" onClick={() => setIsBulkDialogOpen(true)}>
            <Upload className="mr-2 size-4" />
            Bulk Assign
          </Button>
          <Button onClick={() => setIsAssignFormOpen(true)}>
            <Plus className="mr-2 size-4" />
            Assign Role
          </Button>
        </ButtonGroup>
      </div>

      <RolesStats stats={stats} />

      <RolesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <RolePermissionMatrix roles={roles} />

      <RolesTable roles={filteredRoles} canDelete={canDelete} />

      <RoleAuditTimeline events={auditEvents} />

      <AssignRoleForm open={isAssignFormOpen} onOpenChange={setIsAssignFormOpen} salons={salons} />

      <BulkAssignDialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen} salons={salons} />
    </div>
  )
}
