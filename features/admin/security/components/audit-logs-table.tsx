'use client'

import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Shield, Activity } from 'lucide-react'
import type { AuditLog } from '@/features/admin/security/api/queries'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface AuditLogsTableProps {
  logs: AuditLog[]
}

export function AuditLogsTable({ logs }: AuditLogsTableProps): React.JSX.Element {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Audit Logs</ItemTitle>
                <ItemDescription>No audit entries available.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="py-12">
            <Empty>
              <EmptyMedia variant="icon">
                <Activity className="size-6 text-muted-foreground" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No audit logs found</EmptyTitle>
                <EmptyDescription>
                  Audit logs will appear here when users perform actions.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getEventTypeBadge = (eventType: string) => {
    const type = eventType.toLowerCase()
    if (type.includes('create')) return <Badge variant="default">Create</Badge>
    if (type.includes('update')) return <Badge variant="secondary">Update</Badge>
    if (type.includes('delete')) return <Badge variant="destructive">Delete</Badge>
    if (type.includes('login')) return <Badge variant="outline">Login</Badge>
    return <Badge variant="outline">{eventType}</Badge>
  }

  const [page, setPage] = useState(1)
  const pageSize = 10

  const pageCount = Math.max(1, Math.ceil(logs.length / pageSize))

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize
    return logs.slice(start, start + pageSize)
  }, [logs, page, pageSize])

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, logs.length)

  return (
    <Card>
      <CardHeader>
        <div className="sr-only">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Audit logs</ItemTitle>
                <ItemDescription>Latest recorded admin and system activity</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableCaption>Recent audit entries from administrative and system activity.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-muted-foreground" />
                      <div>{getEventTypeBadge(log.event_type)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {log.user_email || log.user_name || log.user_id || 'System'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {log.resource_type ? (
                      <div className="text-sm">
                        <span className="font-medium">{log.resource_type}</span>
                        {log.resource_id && (
                          <span className="text-muted-foreground"> · {log.resource_id.substring(0, 8)}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-muted-foreground">
                      {log.ip_address || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  Showing {startIndex}-{endIndex} of {logs.length} audit entries
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {pageCount}
                  </span>
                </TableCell>
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
  )
}
