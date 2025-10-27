'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteBlockedTime } from '@/features/staff/blocked-times/api/mutations'
import type { BlockedTime } from '@/features/staff/blocked-times/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'

interface BlockedTimesListProps {
  blockedTimes: BlockedTime[]
  onEdit?: (blockedTime: BlockedTime) => void
}

export function BlockedTimesList({ blockedTimes, onEdit }: BlockedTimesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blocked time?')) return

    try {
      setDeletingId(id)
      await deleteBlockedTime(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete blocked time')
    } finally {
      setDeletingId(null)
    }
  }

  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const durationMs = endDate.getTime() - startDate.getTime()
    return Math.round(durationMs / (1000 * 60))
  }

  if (blockedTimes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No blocked times</EmptyTitle>
          <EmptyDescription>Create a blocked time to prevent bookings during specific periods.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Times</CardTitle>
        <CardDescription>Periods when you&apos;re unavailable for appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reason</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockedTimes.map((blockedTime) => (
              <TableRow key={blockedTime['id']}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{blockedTime['reason'] || 'Blocked time'}</span>
                    {blockedTime['is_recurring'] && <Badge variant="secondary" className="w-fit">Recurring</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{blockedTime['block_type']}</Badge>
                </TableCell>
                <TableCell>
                  {blockedTime['start_time'] && format(new Date(blockedTime['start_time']), 'PPp')}
                </TableCell>
                <TableCell>
                  {blockedTime['end_time'] && format(new Date(blockedTime['end_time']), 'p')}
                </TableCell>
                <TableCell className="text-right">
                  {blockedTime['start_time'] && blockedTime['end_time'] && (
                    <span className="text-sm text-muted-foreground">
                      {calculateDuration(blockedTime['start_time'], blockedTime['end_time'])} min
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ButtonGroup className="ml-auto">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(blockedTime)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => blockedTime['id'] && handleDelete(blockedTime['id'])}
                      disabled={deletingId === blockedTime['id']}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
