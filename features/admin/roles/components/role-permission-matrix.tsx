'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserRole } from '@/lib/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface RolePermissionMatrixProps {
  roles: UserRole[]
}

export function RolePermissionMatrix({ roles }: RolePermissionMatrixProps) {
  const matrix = useMemo(() => {
    return roles.reduce<Record<string, Set<string>>>((acc, role) => {
      const key = role['role'] || 'unknown'
      if (!acc[key]) acc[key] = new Set()
      const permissionSet = acc[key]
      if (permissionSet) {
        role['permissions']?.forEach((permission) => permissionSet.add(permission))
      }
      return acc
    }, {})
  }, [roles])

  const roleEntries = Object.entries(matrix)

  if (roleEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission matrix</CardTitle>
          <p className="text-xs text-muted-foreground">
            Aggregated permissions across active assignments. Use row actions to refine individual role permissions.
          </p>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No role assignments detected</EmptyTitle>
              <EmptyDescription>Roles will appear once users receive explicit permission sets.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission matrix</CardTitle>
        <p className="text-xs text-muted-foreground">
          Aggregated permissions across active assignments. Use row actions to refine individual role permissions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {roleEntries.map(([role, permissions]) => (
          <div key={role} className="space-y-2">
            <div className="text-sm font-medium capitalize">{role.replace(/_/g, ' ')}</div>
            {permissions.size === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No custom permissions</EmptyTitle>
                  <EmptyDescription>Assign granular capabilities to extend this role beyond defaults.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup>
                {Array.from(permissions).map((permission) => (
                  <Item key={permission} variant="outline">
                    <ItemContent>
                      <ItemTitle>{permission}</ItemTitle>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
