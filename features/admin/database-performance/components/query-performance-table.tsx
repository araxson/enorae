'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { QueryPerformanceRecord } from '@/features/admin/database-performance/api/queries'

interface QueryPerformanceTableProps {
  queries: QueryPerformanceRecord[]
}

export function QueryPerformanceTable({ queries }: QueryPerformanceTableProps) {
  const getPerformanceColor = (meanTime: number) => {
    if (meanTime > 500) return 'text-destructive'
    if (meanTime > 200) return 'text-primary'
    if (meanTime > 50) return 'text-secondary'
    return 'text-foreground'
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query Hash</TableHead>
            <TableHead>Mean Time (ms)</TableHead>
            <TableHead>Max Time (ms)</TableHead>
            <TableHead>Calls</TableHead>
            <TableHead>Buffer Usage</TableHead>
            <TableHead>Recommended Index</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No query performance data available</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell className="font-mono text-sm">{query.query_hash.slice(0, 8)}</TableCell>
                <TableCell className={`font-semibold ${getPerformanceColor(query.mean_time_ms)}`}>
                  {query.mean_time_ms}ms
                </TableCell>
                <TableCell>{query.max_time_ms}ms</TableCell>
                <TableCell>{query.call_count}</TableCell>
                <TableCell className="text-sm">{formatBytes(query.buffer_usage_bytes)}</TableCell>
                <TableCell>
                  {query.recommended_index ? (
                    <Badge variant="outline">
                      {query.recommended_index}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No index</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
