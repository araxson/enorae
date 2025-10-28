'use client'

import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
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
import { toast } from 'sonner'
import type { StatsFreshnessRecord } from '@/features/admin/statistics-freshness/api/queries'
import { refreshTableStatistics } from '@/features/admin/statistics-freshness/api/mutations'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'

interface FreshnessTableProps {
  tables: StatsFreshnessRecord[]
}

export function FreshnessTable({ tables }: FreshnessTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async (tableName: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('tableName', tableName)
      const result = await refreshTableStatistics(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Statistics refreshed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getFreshnessColor = (date: string) => {
    const days = Math.floor(
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
    )
    if (days > 30) return 'text-destructive'
    if (days > 7) return 'text-primary'
    if (days > 1) return 'text-secondary'
    return 'text-foreground'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="relative" aria-busy={isLoading}>
      <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table Name</TableHead>
            <TableHead>Last Analyze</TableHead>
            <TableHead>Row Estimate</TableHead>
            <TableHead>Dead Rows</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No table statistics available</EmptyTitle>
                    <EmptyDescription>Run analyze jobs or connect a data source to populate freshness metrics.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-mono text-sm">{table.table_name}</TableCell>
                <TableCell className={getFreshnessColor(table.last_analyze)}>
                  {formatDistanceToNow(new Date(table.last_analyze), { addSuffix: true })}
                </TableCell>
                <TableCell>{formatNumber(table.row_estimate)}</TableCell>
                <TableCell className="text-sm">{formatNumber(table.dead_rows)}</TableCell>
                <TableCell>
                  {table.maintenance_recommended ? (
                    <Badge variant="destructive">Stale</Badge>
                  ) : (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ButtonGroup aria-label="Table actions">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefresh(table.table_name)}
                      disabled={isLoading}
                    >
                      Refresh
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
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
          <span className="sr-only">Refreshing table statistics</span>
        </div>
      ) : null}
    </div>
  )
}
