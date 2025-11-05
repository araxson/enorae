'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'
import { deleteBlockedTime } from '@/features/shared/blocked-times/api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/features/shared/ui'
import { EmptyState } from '@/features/shared/ui'
import { Calendar, Repeat } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

interface BlockedTime {
  id: string
  start_time: string
  end_time: string
  reason: string | null
  staff_id: string | null
  is_recurring: boolean | null
  recurrence_pattern: string | null
}

interface BlockedTimesListProps {
  blockedTimes: BlockedTime[]
}

export function BlockedTimesList({ blockedTimes }: BlockedTimesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getRecurrenceLabel = (pattern: string | null): string => {
    if (!pattern) return ''
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      weekdays: 'Weekdays',
      weekends: 'Weekends',
    }
    return labels[pattern] ?? pattern
  }

  async function handleDelete(id: string) {
    setDeletingId(id)

    const result = await deleteBlockedTime(id)

    setDeletingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Blocked time deleted successfully')
      router.refresh()
    }
  }

  if (blockedTimes.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No blocked times"
        description="You haven't blocked any time slots yet"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ItemGroup>
        {blockedTimes.map((blockedTime) => (
          <Item key={blockedTime.id} variant="outline">
            <ItemHeader>
              <div className="flex flex-wrap items-center gap-2">
                <ItemTitle>
                  {format(new Date(blockedTime.start_time), 'PPP')}
                </ItemTitle>
                {blockedTime.is_recurring ? (
                  <div className="flex items-center gap-2">
                    <Repeat className="size-3" aria-hidden="true" />
                    <Badge variant="secondary">
                      {getRecurrenceLabel(blockedTime.recurrence_pattern)}
                    </Badge>
                  </div>
                ) : null}
              </div>
              <ItemActions>
                <ConfirmDialog
                  title="Delete blocked time?"
                  description="Are you sure you want to delete this blocked time? This action cannot be undone."
                  confirmText="Delete"
                  onConfirm={() => handleDelete(blockedTime.id)}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === blockedTime.id}
                  >
                    {deletingId === blockedTime.id ? (
                      <>
                        <Spinner className="size-3" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
                  </Button>
                </ConfirmDialog>
              </ItemActions>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>
                {format(new Date(blockedTime.start_time), 'p')}
                {' '}
                –
                {' '}
                {format(new Date(blockedTime.end_time), 'p')}
              </ItemDescription>
              {blockedTime.reason ? (
                <ItemDescription>{blockedTime.reason}</ItemDescription>
              ) : null}
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
