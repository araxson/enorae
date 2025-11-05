'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { formatDistanceToNow, format } from 'date-fns'

import type { NotificationEntry } from '@/features/business/notifications/api/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type NotificationHistoryTableProps = {
  history: NotificationEntry[]
}

const PAGE_SIZE = 12

const statusTone: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  delivered: 'default',
  sent: 'default',
  queued: 'secondary',
  sending: 'secondary',
  opened: 'default',
  clicked: 'default',
  failed: 'destructive',
  bounced: 'destructive',
  unsubscribed: 'outline',
}

const allStatuses = Object.keys(statusTone)

const toStatusLabel = (value: string) =>
  value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export function NotificationHistoryTable({ history }: NotificationHistoryTableProps) {
  const [selected, setSelected] = useState<NotificationEntry | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusPickerOpen, setStatusPickerOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredHistory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return history
      .filter((entry) => {
        const matchesStatus = statusFilter ? entry.status === statusFilter : true
        const matchesQuery =
          query.length === 0 ||
          [entry.title, entry.message, entry.event_type]
            .filter(Boolean)
            .some((field) => field?.toLowerCase().includes(query))

        return matchesStatus && matchesQuery
      })
      .sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return bDate - aDate
      })
  }, [history, searchTerm, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE))
  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredHistory.slice(start, start + PAGE_SIZE)
  }, [filteredHistory, page])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification history</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No notifications yet</EmptyTitle>
              <EmptyDescription>
                Trigger events or send a test notification to populate history.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const statusLabel = statusFilter ? toStatusLabel(statusFilter) : 'All statuses'

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notification history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <InputGroup className="w-full md:max-w-sm">
              <InputGroupAddon>
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search title, message, or event"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </InputGroup>

            <div className="flex items-center gap-2">
              <Popover open={statusPickerOpen} onOpenChange={setStatusPickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {statusLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <Command>
                    <CommandInput placeholder="Filter statuses..." />
                    <CommandList>
                      <CommandEmpty>No statuses found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setStatusFilter(null)
                            setStatusPickerOpen(false)
                          }}
                        >
                          All statuses
                        </CommandItem>
                        {allStatuses.map((status) => (
                          <CommandItem
                            key={status}
                            value={status}
                            onSelect={(value) => {
                              setStatusFilter(value === statusFilter ? null : value)
                              setStatusPickerOpen(false)
                            }}
                          >
                            {toStatusLabel(status)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter(null)
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {paginatedHistory.length} of {filteredHistory.length} notification
            {filteredHistory.length === 1 ? '' : 's'}.
          </div>

          {filteredHistory.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell className="size-6" aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No notifications match your filters</EmptyTitle>
                <EmptyDescription>Adjust the search or status filter to see more results.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Channels</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Queued</TableHead>
                      <TableHead className="w-24 text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant={statusTone[entry.status || 'queued'] || 'secondary'}>
                            {entry.status || 'queued'}
                          </Badge>
                          {entry.error && (
                            <div className="mt-1 max-w-xs truncate text-xs text-destructive">
                              {entry.error}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(entry.channels || []).map((channel: string) => (
                              <Badge key={channel} variant="outline">
                                <span className="capitalize">{channel}</span>
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize text-sm text-muted-foreground">
                          {(entry.event_type || 'other').replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {entry.message}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.created_at
                            ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(entry)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {pageCount > 1 ? (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(event) => {
                          event.preventDefault()
                          setPage((current) => Math.max(1, current - 1))
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === page}
                          onClick={(event) => {
                            event.preventDefault()
                            setPage(pageNumber)
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(event) => {
                          event.preventDefault()
                          setPage((current) => Math.min(pageCount, current + 1))
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={statusTone[selected.status || 'queued'] || 'default'}>
                    {selected.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {selected.created_at ? format(new Date(selected.created_at), 'PPpp') : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold">{selected.title}</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                  {selected.message}
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-60">
                    <pre className="text-xs">{JSON.stringify(selected.data, null, 2)}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
              {selected.error && (
                <Alert variant="destructive">
                  <AlertTitle>Delivery error</AlertTitle>
                  <AlertDescription>{selected.error}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
