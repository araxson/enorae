'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteBlockedTime } from '../api/mutations'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Box } from '@/components/layout'
import { H4, P, Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { Calendar, Repeat } from 'lucide-react'

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

  const getRecurrenceLabel = (pattern: string | null) => {
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
    return labels[pattern] || pattern
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
    <Stack gap="md">
      {blockedTimes.map((blockedTime) => (
        <Card key={blockedTime.id}>
          <CardContent>
            <Box p="md">
              <Flex justify="between" align="start">
                <Stack gap="xs">
                  <Flex gap="sm" align="center">
                    <H4 className="mb-0">
                      {format(new Date(blockedTime.start_time), 'PPP')}
                    </H4>
                    {blockedTime.is_recurring && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        {getRecurrenceLabel(blockedTime.recurrence_pattern)}
                      </Badge>
                    )}
                  </Flex>
                  <Small className="text-muted-foreground">
                    {format(new Date(blockedTime.start_time), 'p')} -{' '}
                    {format(new Date(blockedTime.end_time), 'p')}
                  </Small>
                  {blockedTime.reason && <P className="mt-2">{blockedTime.reason}</P>}
                </Stack>
                <ConfirmDialog
                  title="Delete Blocked Time?"
                  description="Are you sure you want to delete this blocked time? This action cannot be undone."
                  confirmText="Delete"
                  onConfirm={() => handleDelete(blockedTime.id)}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === blockedTime.id}
                  >
                    {deletingId === blockedTime.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </ConfirmDialog>
              </Flex>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
