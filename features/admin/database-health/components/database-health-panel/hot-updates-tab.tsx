import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type HotUpdateStat = {
  schemaname: unknown
  tablename: unknown
  hot_updates: number | null
  hot_update_percentage: number | null
  status: string | null
}

type HotUpdatesTabProps = {
  hotUpdateStats: HotUpdateStat[]
}

export function HotUpdatesTab({ hotUpdateStats }: HotUpdatesTabProps) {
  if (hotUpdateStats.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No HOT update data available</EmptyTitle>
          <EmptyDescription>HOT update telemetry appears once write volume meets monitoring thresholds.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema.Table</TableHead>
          <TableHead>HOT Updates</TableHead>
          <TableHead>HOT %</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hotUpdateStats.slice(0, 20).map((stat, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-mono text-xs">
              {String(stat.schemaname ?? 'N/A')}.{String(stat.tablename ?? 'N/A')}
            </TableCell>
            <TableCell>{stat.hot_updates?.toLocaleString() ?? 0}</TableCell>
            <TableCell>
              <Badge
                variant={
                  (stat.hot_update_percentage ?? 100) < 50
                    ? 'destructive'
                    : (stat.hot_update_percentage ?? 100) < 75
                      ? 'secondary'
                      : 'default'
                }
              >
                {stat.hot_update_percentage?.toFixed(1) ?? 0}%
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  stat.status === 'critical'
                    ? 'destructive'
                    : stat.status === 'warning'
                      ? 'secondary'
                      : 'default'
                }
              >
                {stat.status ?? 'ok'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
