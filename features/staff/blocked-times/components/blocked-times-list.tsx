'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Pencil, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteBlockedTime } from '@/features/staff/blocked-times/api/mutations'
import type { BlockedTime } from '@/features/staff/blocked-times/api/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'

interface BlockedTimesListProps {
  blockedTimes: BlockedTime[]
  onEdit?: (blockedTime: BlockedTime) => void
}

export function BlockedTimesList({ blockedTimes, onEdit }: BlockedTimesListProps) {
  const router = useRouter()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!pendingDeleteId) return

    setIsDeleting(true)
    try {
      await deleteBlockedTime(pendingDeleteId)
      toast.success('Blocked time removed')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blocked time')
    } finally {
      setIsDeleting(false)
      setPendingDeleteId(null)
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
            <Clock className="size-8" aria-hidden="true" />
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
                  <Item variant="muted" size="sm">
                    <ItemContent>
                      <ItemTitle>{blockedTime['reason'] || 'Blocked time'}</ItemTitle>
                    </ItemContent>
                    {blockedTime['is_recurring'] ? (
                      <ItemActions>
                        <Badge variant="secondary">Recurring</Badge>
                      </ItemActions>
                    ) : null}
                  </Item>
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
                  <ButtonGroup aria-label="Blocked time actions">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(blockedTime)}
                        aria-label="Edit blocked time"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => blockedTime['id'] && setPendingDeleteId(blockedTime['id'])}
                      disabled={isDeleting && pendingDeleteId === blockedTime['id']}
                      aria-label="Delete blocked time"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setPendingDeleteId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blocked time?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reopen the time slot for bookings. You can always create another blocked
              period later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-4" />
                  Deleting…
                </span>
              ) : (
                'Delete blocked time'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
