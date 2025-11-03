'use client'

import { useState } from 'react'
import { format } from 'date-fns'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import type { RateLimitRecord } from '@/features/admin/rate-limit-tracking/api/types'
import {
  unblockIdentifier,
  purgeStaleRecords,
} from '@/features/admin/rate-limit-tracking/api/mutations'
import { Spinner } from '@/components/ui/spinner'

interface RateLimitTableProps {
  records: RateLimitRecord[]
}

export function RateLimitTable({ records }: RateLimitTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUnblock = async (identifier: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('identifier', identifier)
      formData.append('reason', 'Manual admin unblock')
      const result = await unblockIdentifier(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Identifier unblocked')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurge = async (identifier: string, endpoint: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('identifier', identifier)
      formData.append('endpoint', endpoint)
      const result = await purgeStaleRecords(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Stale records purged')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return <Badge variant="destructive">Blocked</Badge>
      case 'warning':
        return <Badge variant="outline">Warning</Badge>
      case 'active':
        return <Badge variant="secondary">Active</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return 'text-destructive'
    if (percentage >= 80) return 'text-primary'
    if (percentage >= 60) return 'text-secondary'
    return 'text-foreground'
  }

  return (
    <div className="relative" aria-busy={isLoading}>
      <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identifier</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Current Count</TableHead>
            <TableHead>Usage %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Attempt</TableHead>
            <TableHead>Next Reset</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No rate limit records found</EmptyTitle>
                    <EmptyDescription>Traffic limit data appears once endpoints record throttled requests.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const usage = record.usagePercent ?? 0
              return (
                <TableRow key={`${record.identifier}:${record.endpoint}`}>
                  <TableCell className="font-mono text-sm">{record.identifier}</TableCell>
                  <TableCell className="font-mono text-sm">{record.endpoint}</TableCell>
                  <TableCell>{record.maxRequests ?? '—'}</TableCell>
                  <TableCell className="font-semibold">{record.requestCount}</TableCell>
                  <TableCell className={`font-semibold ${getUsageColor(usage)}`}>
                    {usage}%
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-sm">
                    {record.lastRequestAt ? format(new Date(record.lastRequestAt), 'MMM dd, HH:mm') : '—'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.windowEndAt ? format(new Date(record.windowEndAt), 'MMM dd, HH:mm') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Open rate limit actions for ${record.identifier}`}
                          disabled={isLoading}
                        >
                          {isLoading ? <Spinner className="size-4" /> : <MoreHorizontal className="size-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUnblock(record.identifier)}
                          disabled={isLoading}
                        >
                          Unblock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePurge(record.identifier, record.endpoint)}
                          disabled={isLoading}
                        >
                          Purge Stale Records
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center"
        >
          <Spinner className="size-6" />
          <span className="sr-only">Refreshing rate limit data</span>
        </div>
      ) : null}
    </div>
  )
}
