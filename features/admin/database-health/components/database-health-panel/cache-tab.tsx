import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type CachePerformance = {
  schemaname: unknown
  tablename: unknown
  cache_hit_ratio: number | null
  cache_hits: number | null
  disk_reads: number | null
}

type CacheTabProps = {
  cachePerformance: CachePerformance[]
}

export function CacheTab({ cachePerformance }: CacheTabProps) {
  if (cachePerformance.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No cache data available</EmptyTitle>
          <EmptyDescription>Once cache hit metrics arrive, they will populate here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema.Table</TableHead>
          <TableHead>Cache Hit Ratio</TableHead>
          <TableHead>Cache Hits</TableHead>
          <TableHead>Disk Reads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cachePerformance.slice(0, 20).map((table, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-mono text-xs">
              {String(table.schemaname ?? 'N/A')}.{String(table.tablename ?? 'N/A')}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  (table.cache_hit_ratio ?? 100) < 80
                    ? 'destructive'
                    : (table.cache_hit_ratio ?? 100) < 90
                      ? 'secondary'
                      : 'default'
                }
              >
                {table.cache_hit_ratio?.toFixed(1) ?? 0}%
              </Badge>
            </TableCell>
            <TableCell>{table.cache_hits?.toLocaleString() ?? 0}</TableCell>
            <TableCell>{table.disk_reads?.toLocaleString() ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
