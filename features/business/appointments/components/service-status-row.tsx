'use client'

import { memo } from 'react'
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ButtonGroup } from '@/components/ui/button-group'

type ServiceStatusRowProps = {
  serviceId: string
  status: string | null
  updatingId: string | null
  onStatusUpdate: (serviceId: string, newStatus: string) => void
}

export const ServiceStatusRow = memo(function ServiceStatusRow({
  serviceId,
  status,
  updatingId,
  onStatusUpdate,
}: ServiceStatusRowProps) {
  const isCancelled = status === 'cancelled'
  const nextStatus = getNextStatus(status)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          {getStatusIcon(status)}
          <div className="flex-1">
            <p className="font-medium">Service ID: {serviceId}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">{getStatusLabel(status)}</Badge>
            </div>
          </div>
        </div>

        <ButtonGroup aria-label="Service actions">
          {!isCancelled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(serviceId, nextStatus)}
              disabled={updatingId === serviceId}
            >
              {updatingId === serviceId
                ? 'Updating...'
                : status === 'completed'
                ? 'Reset'
                : 'Mark ' + getStatusLabel(nextStatus)}
            </Button>
          ) : null}
          {status !== 'cancelled' && status !== 'completed' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusUpdate(serviceId, 'cancelled')}
              disabled={updatingId === serviceId}
            >
              Cancel
            </Button>
          ) : null}
        </ButtonGroup>
      </CardContent>
    </Card>
  )
})

function getStatusIcon(status: string | null) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-5 text-primary" />
    case 'in_progress':
      return <Clock className="size-5 text-secondary" />
    case 'cancelled':
      return <XCircle className="size-5 text-destructive" />
    default:
      return <Circle className="size-5 text-muted-foreground/40" />
  }
}

function getNextStatus(currentStatus: string | null) {
  switch (currentStatus) {
    case 'pending':
      return 'in_progress'
    case 'in_progress':
      return 'completed'
    case 'completed':
      return 'pending'
    default:
      return 'in_progress'
  }
}

function getStatusLabel(status: string | null) {
  return status ? status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Pending'
}
