'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Shield, ShieldOff, Trash2, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { UserRole } from '@/lib/types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

const formatRoleLabel = (role: string | null | undefined) =>
  role ? role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'N/A'

// Helper function to categorize permissions
const categorizePermissions = (permissions: string[] | null | undefined) => {
  if (!permissions || permissions.length === 0) return null

  const categories = {
    userManagement: [] as string[],
    contentManagement: [] as string[],
    settings: [] as string[],
    other: [] as string[],
  }

  permissions.forEach((perm) => {
    const lower = perm.toLowerCase()
    if (lower.includes('user') || lower.includes('profile') || lower.includes('account')) {
      categories.userManagement.push(perm)
    } else if (
      lower.includes('content') ||
      lower.includes('post') ||
      lower.includes('review') ||
      lower.includes('comment')
    ) {
      categories.contentManagement.push(perm)
    } else if (
      lower.includes('setting') ||
      lower.includes('config') ||
      lower.includes('system')
    ) {
      categories.settings.push(perm)
    } else {
      categories.other.push(perm)
    }
  })

  return categories
}

type Props = {
  roles: UserRole[]
  canDelete: boolean
  onRevoke: (role: UserRole) => void
  onDelete: (role: UserRole) => void
  onEditPermissions: (role: UserRole) => void
}

function PermissionsCell({ role }: { role: UserRole }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const permissions = role['permissions']
  const categories = categorizePermissions(permissions)

  if (!categories) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const totalCount = permissions?.length || 0
  const hasMultiple = totalCount > 3

  if (!hasMultiple) {
    return (
      <div className="flex flex-wrap gap-1">
        {permissions?.map((perm, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {perm}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-0 hover:bg-transparent"
      >
        {isExpanded ? (
          <ChevronDown className="mr-1 h-3 w-3" />
        ) : (
          <ChevronRight className="mr-1 h-3 w-3" />
        )}
        <span className="text-sm">
          {totalCount} {totalCount === 1 ? 'permission' : 'permissions'}
        </span>
      </Button>

      {isExpanded && (
        <Accordion type="multiple" className="w-full">
          {categories.userManagement.length > 0 && (
            <AccordionItem value="user">
              <AccordionTrigger className="py-2 text-xs">
                User Management
                <Badge variant="secondary" className="ml-2">
                  {categories.userManagement.length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {categories.userManagement.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {categories.contentManagement.length > 0 && (
            <AccordionItem value="content">
              <AccordionTrigger className="py-2 text-xs">
                Content Management
                <Badge variant="secondary" className="ml-2">
                  {categories.contentManagement.length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {categories.contentManagement.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {categories.settings.length > 0 && (
            <AccordionItem value="settings">
              <AccordionTrigger className="py-2 text-xs">
                Settings
                <Badge variant="secondary" className="ml-2">
                  {categories.settings.length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {categories.settings.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {categories.other.length > 0 && (
            <AccordionItem value="other">
              <AccordionTrigger className="py-2 text-xs">
                Other
                <Badge variant="secondary" className="ml-2">
                  {categories.other.length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {categories.other.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  )
}

export function RolesTableContent({ roles, canDelete, onRevoke, onDelete, onEditPermissions }: Props) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Role assignments</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>Manage user roles, permissions, and status per salon.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Role assignments by user, salon, and status.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Salon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No role assignments found</EmptyTitle>
                      <EmptyDescription>Assign roles to staff or administrators to manage permissions.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => {
                const displayUserId = role['user_id'] ? role['user_id'].slice(0, 8) : 'Unassigned'
                const displaySalonId = role['salon_id'] ? role['salon_id'].slice(0, 8) : '—'

                return (
                  <TableRow key={role['id'] ?? `${role['user_id']}-${role['role']}`}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{displayUserId}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {role['user_id'] || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="size-3" />
                        <Badge variant="outline">{formatRoleLabel(role['role'])}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{displaySalonId}</span>
                    </TableCell>
                    <TableCell>
                      {role['is_active'] ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <PermissionsCell role={role} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role['created_at'] ? format(new Date(role['created_at']), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={`Open role actions for ${role['role'] ?? 'role'}`}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditPermissions(role)}>
                            <Shield className="mr-2 size-4" />
                            Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {role['is_active'] ? (
                            <DropdownMenuItem onClick={() => onRevoke(role)}>
                              <ShieldOff className="mr-2 size-4" />
                              Revoke Role
                            </DropdownMenuItem>
                          ) : null}
                          {canDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(role)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete Permanently
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <span className="text-sm text-muted-foreground">
                  Total assignments: {roles.length}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
