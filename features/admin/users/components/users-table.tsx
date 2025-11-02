'use client'

import { useState, memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { User } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { UsersMobileTable } from './users-table-mobile'
import { UserTableRow } from './users-table-row'

type UserWithDetails = {
  id: string
  username: string | null
  email: string | null
  full_name: string | null
  deleted_at: string | null
  created_at: string | null
  roles: string[]
  session_count?: number | null
}

interface UsersTableProps {
  users: UserWithDetails[]
  onSuspend: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onReactivate: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onTerminateSessions: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export const UsersTable = memo(function UsersTable({
  users,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
}: UsersTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  if (users.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <User aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No users found</EmptyTitle>
          <EmptyDescription>Invite staff and administrators to populate the directory.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          Once accounts are created, role assignments, sessions, and status appear automatically.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <div className="sr-only">
              <CardTitle>Platform users</CardTitle>
              <CardDescription>Manage staff and administrator accounts</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="-m-6">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active Sessions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        isLoading={loadingUserId === user.id}
                        onSuspend={onSuspend}
                        onReactivate={onReactivate}
                        onTerminateSessions={onTerminateSessions}
                        onDelete={onDelete}
                        onLoadingChange={(loading) => setLoadingUserId(loading ? user.id : null)}
                      />
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden">
        <UsersMobileTable
          users={users}
          loadingUserId={loadingUserId}
          onSuspend={onSuspend}
          onReactivate={onReactivate}
          onTerminateSessions={onTerminateSessions}
          onDelete={onDelete}
          onLoadingChange={setLoadingUserId}
        />
      </div>
    </>
  )
})
