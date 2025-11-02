import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type ToastUsage = {
  schemaname: unknown
  tablename: unknown
  main_size: string | null
  toast_and_index_size: string | null
  toast_index_percentage: number | null
  total_size: string | null
}

type ToastTabProps = {
  toastUsage: ToastUsage[]
}

export function ToastTab({ toastUsage }: ToastTabProps) {
  if (toastUsage.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No TOAST usage data available</EmptyTitle>
          <EmptyDescription>Large object storage metrics will surface when TOAST usage is observed.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Schema.Table</TableHead>
          <TableHead>Main Size</TableHead>
          <TableHead>TOAST + Index</TableHead>
          <TableHead>TOAST Index %</TableHead>
          <TableHead>Total Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {toastUsage.slice(0, 20).map((usage, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-mono text-xs">
              {String(usage.schemaname ?? 'N/A')}.{String(usage.tablename ?? 'N/A')}
            </TableCell>
            <TableCell>{String(usage.main_size ?? 'N/A')}</TableCell>
            <TableCell>{String(usage.toast_and_index_size ?? 'N/A')}</TableCell>
            <TableCell>
              <Badge
                variant={
                  (usage.toast_index_percentage ?? 0) > 50
                    ? 'secondary'
                    : 'default'
                }
              >
                {usage.toast_index_percentage?.toFixed(1) ?? 0}%
              </Badge>
            </TableCell>
            <TableCell>{String(usage.total_size ?? 'N/A')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
