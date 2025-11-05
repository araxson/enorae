'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatDistanceToNow } from 'date-fns'
import type { MessageThreadWithInsights } from '@/features/admin/messages/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface MessagesTableProps {
  threads: MessageThreadWithInsights[]
}

declare global {
  interface WindowEventMap {
    'admin:clearSignals': CustomEvent<string>
  }
}

const formatMinutes = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  if (value < 1) return '<1m'
  const hours = Math.floor(value / 60)
  const minutes = Math.round(value % 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const priorityVariant = (priority: string | null | undefined) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'destructive'
    case 'high':
      return 'secondary'
    case 'low':
      return 'outline'
    default:
      return 'default'
  }
}

const statusVariant = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
    case 'closed':
      return 'secondary'
    case 'archived':
      return 'outline'
    case 'in_progress':
      return 'default'
    default:
      return 'default'
  }
}

export function MessagesTable({ threads }: MessagesTableProps) {
  const pageSize = 10
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(threads.length / pageSize))

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const paginatedThreads = useMemo(() => {
    const start = (page - 1) * pageSize
    return threads.slice(start, start + pageSize)
  }, [threads, page, pageSize])

  const startIndex = threads.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endIndex = threads.length === 0 ? 0 : Math.min(page * pageSize, threads.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Threads</CardTitle>
        <CardDescription>Conversation activity and SLA indicators.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableCaption>Conversation threads with activity and signal indicators.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Salon</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Unread</TableHead>
                <TableHead>First Response</TableHead>
                <TableHead>Last Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedThreads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>No message threads</EmptyTitle>
                        <EmptyDescription>No threads match the selected filters.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedThreads.map((thread) => {
                  const hasAlerts = thread.hasFlaggedMessages || thread.unresolvedReports > 0
                  const rowHighlight = hasAlerts ? 'bg-muted/40' : undefined
                  const rowKey =
                    thread['id'] ??
                    `${thread['salon_id'] ?? 'salon'}-${thread['customer_id'] ?? 'customer'}-${thread['last_message_at'] ?? thread['created_at']}`
                  const customerUnread = thread['unread_count_customer'] ?? 0
                  const staffUnread = thread['unread_count_staff'] ?? 0
                  const threadHref = thread['id'] ? `/admin/messages/${thread['id']}` : '#'

                  return (
                    <ContextMenu key={rowKey}>
                      <ContextMenuTrigger asChild>
                        <TableRow className={rowHighlight}>
                          <TableCell className="space-y-1">
                            <div className="font-medium leading-tight">
                              {thread['subject'] || 'No subject'}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                Recent messages:&nbsp;
                                {thread.recentMessageCount}
                              </span>
                              <span>
                                Thread ID:&nbsp;
                                {thread['id'] ?? '—'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium leading-tight">{thread['salon_name']}</div>
                            <p className="text-xs text-muted-foreground">{thread['salon_id']}</p>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium leading-tight">{thread['customer_name']}</div>
                            <p className="text-xs text-muted-foreground">{thread['customer_email']}</p>
                          </TableCell>
                          <TableCell>
                            {thread['staff_name'] ? (
                              <div>
                                <div className="font-medium leading-tight">{thread['staff_name']}</div>
                                <p className="text-xs text-muted-foreground">{thread['staff_email']}</p>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">Unassigned</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={priorityVariant(thread['priority'])}>
                              {thread['priority'] ?? 'normal'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(thread['status'])}>
                              {thread['status'] ?? 'open'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {thread.hasFlaggedMessages ? (
                                <Badge variant="destructive">Flagged {thread.flaggedMessageCount}</Badge>
                              ) : null}
                              {thread.unresolvedReports > 0 ? (
                                <Badge variant="secondary">Reports {thread.unresolvedReports}</Badge>
                              ) : null}
                              {!thread.hasFlaggedMessages && thread.unresolvedReports === 0 ? (
                                <Badge variant="outline">No signals</Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {customerUnread > 0 ? (
                                <Badge variant="outline">C: {customerUnread}</Badge>
                              ) : null}
                              {staffUnread > 0 ? (
                                <Badge variant="outline">S: {staffUnread}</Badge>
                              ) : null}
                              {customerUnread === 0 && staffUnread === 0 ? (
                                <p className="text-xs text-muted-foreground">—</p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>{formatMinutes(thread.firstResponseMinutes)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {thread['last_message_at']
                              ? formatDistanceToNow(new Date(thread['last_message_at']), { addSuffix: true })
                              : 'Never'}
                          </TableCell>
                        </TableRow>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuLabel>Thread actions</ContextMenuLabel>
                        <ContextMenuItem asChild>
                          <Link href={threadHref}>Open thread</Link>
                        </ContextMenuItem>
                        <ContextMenuItem asChild>
                          <a href={`mailto:${thread['customer_email'] ?? ''}`}>Email customer</a>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          disabled={!hasAlerts}
                          onSelect={() => {
                            if (hasAlerts && typeof window !== 'undefined') {
                              window.dispatchEvent(new CustomEvent('admin:clearSignals', { detail: rowKey }))
                            }
                          }}
                        >
                          Dismiss signals
                        </ContextMenuItem>
                        <ContextMenuItem
                          onSelect={() => {
                            if (typeof navigator !== 'undefined' && rowKey) {
                              navigator.clipboard?.writeText(String(rowKey)).catch(() => {})
                            }
                          }}
                        >
                          Copy thread ID
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  Showing {startIndex}-{endIndex} of {threads.length} threads
                </TableCell>
                <TableCell colSpan={3} className="text-right text-sm text-muted-foreground">
                  Page {page} of {pageCount}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {threads.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  )
}
