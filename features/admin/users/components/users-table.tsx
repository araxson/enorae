'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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

export function UsersTable({
  users,
  onSuspend,
  onReactivate,
  onTerminateSessions,
  onDelete,
}: UsersTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const pageCount = Math.max(1, Math.ceil(users.length / pageSize))

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    return users.slice(start, start + pageSize)
  }, [users, page, pageSize])

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const startIndex = users.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endIndex = users.length === 0 ? 0 : Math.min(page * pageSize, users.length)

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
            <ScrollArea className="w-full">
              <Table>
                <TableCaption>Staff and administrator accounts with role metadata.</TableCaption>
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
                  {paginatedUsers.map((user) => (
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
                <TableFooter>
                  <TableRow>
                    <TableHead colSpan={5}>
                      Showing {startIndex}-{endIndex} of {users.length} users
                    </TableHead>
                    <TableHead colSpan={2} className="text-right">
                      Page {page} of {pageCount}
                    </TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (page > 1) {
                        setPage(page - 1)
                      }
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }, (_, index) => {
                  const value = index + 1
                  return (
                    <PaginationItem key={value}>
                      <PaginationLink
                        href="#"
                        isActive={value === page}
                        onClick={(event) => {
                          event.preventDefault()
                          setPage(value)
                        }}
                      >
                        {value}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (page < pageCount) {
                        setPage(page + 1)
                      }
                    }}
                    className={page === pageCount ? 'pointer-events-none opacity-50' : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
}
