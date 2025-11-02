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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

/**
 * Unused indexes tab content
 */
export function IndexesTab({ indexes }: { indexes: Array<Record<string, unknown>> }) {
  if (indexes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No unused indexes detected</EmptyTitle>
          <EmptyDescription>Every monitored index has recent scan activity.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema</TableHead>
          <TableHead>Index Name</TableHead>
          <TableHead>Scans</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {indexes.slice(0, 30).map((idx, index) => (
          <TableRow key={index}>
            <TableCell>{String(idx['schemaname'] ?? 'N/A')}</TableCell>
            <TableCell className="font-mono text-xs">{String(idx['index_name'] ?? 'N/A')}</TableCell>
            <TableCell>
              <Badge variant={(idx['scans'] ?? 0) === 0 ? 'destructive' : 'default'}>
                {idx['scans']?.toLocaleString() ?? 0}
              </Badge>
            </TableCell>
            <TableCell>{String(idx['index_size'] ?? 'N/A')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
