'use client'

import { useState } from 'react'
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
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import type { ToastUsageRecord } from '@/features/admin/database-toast/api/queries'
import { optimizeToastUsage } from '@/features/admin/database-toast/api/mutations'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

interface ToastUsageTableProps {
  tables: ToastUsageRecord[]
}

export function ToastUsageTable({ tables }: ToastUsageTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleOptimize = async (tableName: string, columnName: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('tableName', tableName)
      formData.append('columnName', columnName)
      formData.append('compressionType', 'pglz')
      const result = await optimizeToastUsage(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Column optimized')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getToastBadge = (percentage: number) => {
    if (percentage > 30) return <Badge variant="destructive">High</Badge>
    if (percentage > 20) return <Badge variant="outline">Medium</Badge>
    if (percentage > 10) return <Badge variant="secondary">Low</Badge>
    return <Badge variant="outline">Minimal</Badge>
  }

  return (
    <div className="relative" aria-busy={isLoading}>
      <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table Name</TableHead>
            <TableHead>TOAST Size</TableHead>
            <TableHead>Table Size</TableHead>
            <TableHead>TOAST %</TableHead>
            <TableHead>Compression Suggestion</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No TOAST usage data available</EmptyTitle>
                    <EmptyDescription>Large-object storage metrics populate after Postgres TOAST stats are synced.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-mono text-sm">{table.table_name}</TableCell>
                <TableCell>{formatBytes(table.toast_bytes)}</TableCell>
                <TableCell>{formatBytes(table.table_bytes)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getToastBadge(table.toast_percentage)}
                    <span className="text-sm">{Math.round(table.toast_percentage)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {table.suggested_compression ? (
                    <Badge variant="outline">{table.suggested_compression}</Badge>
                  ) : (
                    <Badge variant="secondary">No suggestion</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="size-8 p-0"
                        aria-label={`Open TOAST actions for ${table.table_name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table.suggested_compression && (
                        <DropdownMenuItem
                          onClick={() => handleOptimize(table.table_name, 'main_column')}
                          disabled={isLoading}
                        >
                          Optimize
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          <span className="sr-only">Updating TOAST usage metrics</span>
        </div>
      ) : null}
    </div>
  )
}
