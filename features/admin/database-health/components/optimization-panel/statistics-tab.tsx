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
 * Statistics freshness tab content
 */
export function StatisticsTab({ statistics }: { statistics: Array<Record<string, unknown>> }) {
  if (statistics.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No statistics data available</EmptyTitle>
          <EmptyDescription>
            Statistics health appears once analyze jobs report freshness.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema.Table</TableHead>
          <TableHead>Live Rows</TableHead>
          <TableHead>Last Analyze</TableHead>
          <TableHead>Last Auto-analyze</TableHead>
          <TableHead>Freshness</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statistics.slice(0, 30).map((stat, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-mono text-xs">
              {String(stat['schemaname'] ?? 'N/A')}.{String(stat['tablename'] ?? 'N/A')}
            </TableCell>
            <TableCell>{stat['live_rows']?.toLocaleString() ?? 0}</TableCell>
            <TableCell className="text-xs">
              {stat['last_analyze'] && typeof stat['last_analyze'] === 'string'
                ? new Date(stat['last_analyze']).toLocaleDateString()
                : 'Never'}
            </TableCell>
            <TableCell className="text-xs">
              {stat['last_autoanalyze'] && typeof stat['last_autoanalyze'] === 'string'
                ? new Date(stat['last_autoanalyze']).toLocaleDateString()
                : 'Never'}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  stat['freshness'] === 'stale'
                    ? 'destructive'
                    : stat['freshness'] === 'aging'
                      ? 'secondary'
                      : 'default'
                }
              >
                {String(stat['freshness'] ?? 'unknown')}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
