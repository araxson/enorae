'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex } from '@/components/layout'
import { H3, P, Muted } from '@/components/ui/typography'
import { deleteBlockedTime } from '../api/mutations'
import type { BlockedTime } from '../types'

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

  if (blockedTimes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <P className="text-muted-foreground">No blocked times found</P>
      </Card>
    )
  }

  return (
    <Stack gap="md">
      {blockedTimes.map((blockedTime) => (
        <Card key={blockedTime.id} className="p-4">
          <Flex justify="between" align="start">
            <Stack gap="sm" className="flex-1">
              <Flex align="center" gap="sm">
                <H3>{blockedTime.reason}</H3>
                <Badge variant="outline">
                  {blockedTime.block_type}
                </Badge>
                {blockedTime.is_recurring && (
                  <Badge variant="secondary">Recurring</Badge>
                )}
              </Flex>

              <Muted>
                {blockedTime.start_time && format(new Date(blockedTime.start_time), 'PPp')} - {blockedTime.end_time && format(new Date(blockedTime.end_time), 'p')}
              </Muted>

              {blockedTime.duration_minutes && (
                <Muted>
                  Duration: {blockedTime.duration_minutes} minutes
                </Muted>
              )}
            </Stack>

            <Flex gap="sm">
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
                onClick={() => blockedTime.id && handleDelete(blockedTime.id)}
                disabled={deletingId === blockedTime.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
