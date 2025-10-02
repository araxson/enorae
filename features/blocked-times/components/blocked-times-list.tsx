'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBlockedTime } from '../actions/blocked-times.actions'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex, Grid, Box } from '@/components/layout'
import { H4, P, Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'

interface BlockedTime {
  id: string
  start_time: string
  end_time: string
  reason: string | null
  staff_id: string | null
  is_recurring: boolean | null
}

interface BlockedTimesListProps {
  blockedTimes: BlockedTime[]
}

export function BlockedTimesList({ blockedTimes }: BlockedTimesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blocked time?')) {
      return
    }

    setDeletingId(id)

    const result = await deleteBlockedTime(id)

    setDeletingId(null)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  if (blockedTimes.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box py="lg" className="text-center">
            <P className="text-muted-foreground">No blocked times found</P>
          </Box>
        </CardContent>
      </Card>
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
                      <Badge variant="secondary">Recurring</Badge>
                    )}
                  </Flex>
                  <Small className="text-muted-foreground">
                    {format(new Date(blockedTime.start_time), 'p')} -{' '}
                    {format(new Date(blockedTime.end_time), 'p')}
                  </Small>
                  {blockedTime.reason && <P className="mt-2">{blockedTime.reason}</P>}
                </Stack>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blockedTime.id)}
                  disabled={deletingId === blockedTime.id}
                >
                  {deletingId === blockedTime.id ? 'Deleting...' : 'Delete'}
                </Button>
              </Flex>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
