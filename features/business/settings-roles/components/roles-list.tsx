'use client'

import { Shield, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import type { UserRoleWithDetails } from '@/features/business/settings-roles/api/queries'
import { format } from 'date-fns'

type RolesListProps = {
  roles: UserRoleWithDetails[]
  onEdit: (role: UserRoleWithDetails) => void
  onDeactivate: (id: string) => void
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  platform_admin: 'Platform Admin',
  tenant_owner: 'Tenant Owner',
  salon_owner: 'Salon Owner',
  salon_manager: 'Salon Manager',
  senior_staff: 'Senior Staff',
  staff: 'Staff',
  junior_staff: 'Junior Staff',
  customer: 'Customer',
  vip_customer: 'VIP Customer',
  guest: 'Guest',
}

const ROLE_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  super_admin: 'destructive',
  platform_admin: 'destructive',
  tenant_owner: 'default',
  salon_owner: 'default',
  salon_manager: 'default',
  senior_staff: 'secondary',
  staff: 'secondary',
  junior_staff: 'outline',
  customer: 'outline',
  vip_customer: 'secondary',
  guest: 'outline',
}

export function RolesList({ roles, onEdit, onDeactivate }: RolesListProps) {
  if (roles.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Shield className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No user roles found</EmptyTitle>
          <EmptyDescription>Roles will appear once they are created.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Create roles to assign permissions and manage team access.</EmptyContent>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Salon</TableHead>
          <TableHead>Assigned</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role['id']}>
            <TableCell>
              <div className="font-medium">
                {role.user?.['full_name'] || 'Unknown User'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {role.user?.['email'] || '-'}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={role['role'] ? (ROLE_COLORS[role['role']] || 'default') : 'default'}>
                {role['role'] ? (ROLE_LABELS[role['role']] || role['role']) : 'Unknown'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {role.salon?.['name'] || '-'}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {role['created_at']
                  ? format(new Date(role['created_at']), 'MMM dd, yyyy')
                  : 'N/A'}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(role)}>
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => role['id'] && onDeactivate(role['id'])}
                    className="text-destructive"
                  >
                    Deactivate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
