'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stack, Flex, Box } from '@/components/layout'
import { P, Small, Large } from '@/components/ui/typography'
import { approveTimeOffRequest, rejectTimeOffRequest } from '../actions/time-off.actions'
import { useTransition } from 'react'
import type { TimeOffRequestWithStaff } from '../dal/time-off.queries'

interface RequestCardProps {
  request: TimeOffRequestWithStaff
}

export function RequestCard({ request }: RequestCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request.id)
      await approveTimeOffRequest(formData)
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request.id)
      await rejectTimeOffRequest(formData)
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Card className="p-4">
      <Stack gap="sm">
        <Flex justify="between" align="start">
          <Box>
            <Large>{request.staff?.profiles?.username || 'Staff Member'}</Large>
            <Small className="text-muted-foreground capitalize">{request.request_type.replace('_', ' ')}</Small>
          </Box>
          <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
        </Flex>

        <Stack gap="xs">
          <Flex gap="sm">
            <Small className="text-muted-foreground">From:</Small>
            <Small>{new Date(request.start_at).toLocaleDateString()}</Small>
          </Flex>
          <Flex gap="sm">
            <Small className="text-muted-foreground">To:</Small>
            <Small>{new Date(request.end_at).toLocaleDateString()}</Small>
          </Flex>
          {request.reason && (
            <Box>
              <Small className="text-muted-foreground">Reason:</Small>
              <Small>{request.reason}</Small>
            </Box>
          )}
        </Stack>

        {request.status === 'pending' && (
          <Flex justify="end" gap="sm">
            <Button size="sm" variant="outline" onClick={handleReject} disabled={isPending}>
              Reject
            </Button>
            <Button size="sm" onClick={handleApprove} disabled={isPending}>
              Approve
            </Button>
          </Flex>
        )}
      </Stack>
    </Card>
  )
}
