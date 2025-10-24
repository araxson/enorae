'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserRole } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

interface RolePermissionMatrixProps {
  roles: UserRole[]
}

export function RolePermissionMatrix({ roles }: RolePermissionMatrixProps) {
  const matrix = useMemo(() => {
    return roles.reduce<Record<string, Set<string>>>((acc, role) => {
      const key = role.role || 'unknown'
      if (!acc[key]) acc[key] = new Set()
      role.permissions?.forEach((permission) => acc[key].add(permission))
      return acc
    }, {})
  }, [roles])

  const roleEntries = Object.entries(matrix)

  if (roleEntries.length === 0) {
    return null
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
              <p className="text-xs text-muted-foreground">No custom permissions</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Array.from(permissions).map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
