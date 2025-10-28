import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AppointmentOverviewRow } from '@/features/admin/appointments/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'

interface RecentAppointmentsTableProps {
  appointments: AppointmentOverviewRow[]
}

const formatDateTime = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  completed: 'default',
  pending: 'secondary',
  confirmed: 'secondary',
  cancelled: 'destructive',
  no_show: 'outline',
  in_progress: 'default',
  checked_in: 'default',
  rescheduled: 'outline',
  draft: 'secondary',
}

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Most Recent Appointments</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          {appointments.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No appointments returned</EmptyTitle>
                <EmptyDescription>Supabase has no appointments for the selected window.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 40).map((appointment) => (
                  <TableRow
                    key={appointment['id'] ?? `${appointment['salon_id']}-${appointment['start_time']}`}
                    className="align-top"
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">{appointment['salon_name'] || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">#{appointment['confirmation_code'] || '—'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {appointment['customer_name'] || 'Walk-in'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {appointment['staff_name'] || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <Badge variant={STATUS_VARIANTS[appointment['status'] ?? 'pending'] ?? 'secondary'}>
                          {(appointment['status'] || 'pending')
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(appointment['start_time'])}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {appointment['duration_minutes'] ? `${appointment['duration_minutes']} min` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {appointments.length === 0 ? null : <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
