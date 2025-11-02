import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type BloatedTable = {
  schemaname: unknown
  tablename: unknown
  dead_tuples: number | null
  dead_tuple_percent: number | null
  last_analyze: string | null
  total_size: string | null
}

type BloatTabProps = {
  bloatedTables: BloatedTable[]
}

export function BloatTab({ bloatedTables }: BloatTabProps) {
  if (bloatedTables.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No table bloat detected</EmptyTitle>
          <EmptyDescription>Tables remain within healthy vacuum thresholds.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema.Table</TableHead>
          <TableHead>Dead Tuples</TableHead>
          <TableHead>Dead %</TableHead>
          <TableHead>Last Analyze</TableHead>
          <TableHead>Total Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bloatedTables.slice(0, 20).map((table, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-mono text-xs">
              {String(table.schemaname ?? 'N/A')}.{String(table.tablename ?? 'N/A')}
            </TableCell>
            <TableCell>{table.dead_tuples?.toLocaleString() ?? 0}</TableCell>
            <TableCell>
              <Badge
                variant={
                  (table.dead_tuple_percent ?? 0) > 20
                    ? 'destructive'
                    : (table.dead_tuple_percent ?? 0) > 10
                      ? 'secondary'
                      : 'default'
                }
              >
                {table.dead_tuple_percent?.toFixed(1) ?? 0}%
              </Badge>
            </TableCell>
            <TableCell className="text-xs">
              {table.last_analyze
                ? new Date(table.last_analyze).toLocaleDateString()
                : 'Never'}
            </TableCell>
            <TableCell>{String(table.total_size ?? 'N/A')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
