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
    if (days > 30) return 'text-red-600'
    if (days > 7) return 'text-orange-600'
    if (days > 1) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
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
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No table statistics available
              </TableCell>
            </TableRow>
          ) : (
            tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-mono text-sm">{table.table_name}</TableCell>
                <TableCell className={`${getFreshnessColor(table.last_analyze)}`}>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRefresh(table.table_name)}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
