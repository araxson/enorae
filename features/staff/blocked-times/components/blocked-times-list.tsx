'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No blocked times found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {blockedTimes.map((blockedTime) => (
        <Card key={blockedTime.id}>
          <CardHeader className="p-4 pb-0">
            <div className="flex gap-3 items-start justify-between">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex gap-3 items-center flex-wrap">
                  <CardTitle>{blockedTime.reason || 'Blocked time'}</CardTitle>
                  <Badge variant="outline">{blockedTime.block_type}</Badge>
                  {blockedTime.is_recurring && <Badge variant="secondary">Recurring</Badge>}
                </div>
                <CardDescription>
                  {blockedTime.start_time && format(new Date(blockedTime.start_time), 'PPp')} –{' '}
                  {blockedTime.end_time && format(new Date(blockedTime.end_time), 'p')}
                </CardDescription>
              </div>
              <div className="flex gap-3">
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
              </div>
            </div>
          </CardHeader>
          {blockedTime.duration_minutes ? (
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Duration: {blockedTime.duration_minutes} minutes
              </p>
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
