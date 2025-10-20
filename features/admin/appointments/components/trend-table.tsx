import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AppointmentTrendPoint } from '../api/types'

interface TrendTableProps {
  trend: AppointmentTrendPoint[]
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export function TrendTable({ trend }: TrendTableProps) {
  const rows = trend.slice(-14)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>14-day Trend</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trend data from Supabase yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Cancelled</TableHead>
                <TableHead>No-shows</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((entry) => (
                <TableRow key={entry.date}>
                  <TableCell className="font-medium text-foreground">{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.total}</TableCell>
                  <TableCell>{entry.completed}</TableCell>
                  <TableCell>{entry.cancelled}</TableCell>
                  <TableCell>{entry.noShow}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
