'use client'

import { Clock } from 'lucide-react'
import { ItemDescription } from '@/components/ui/item'
import { format } from 'date-fns'

type RequestDetailsProps = {
  startAt: string | null
  endAt: string | null
  durationDays: number | null
  requestType: string | null
  reason: string | null
}

export function RequestDetails({ startAt, endAt, durationDays, requestType, reason }: RequestDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <ItemDescription>Start Date</ItemDescription>
          <span>
            {startAt ? format(new Date(startAt), 'MMM dd, yyyy') : 'N/A'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <ItemDescription>End Date</ItemDescription>
          <span>
            {endAt ? format(new Date(endAt), 'MMM dd, yyyy') : 'N/A'}
          </span>
        </div>
      </div>

      {durationDays && (
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>{durationDays} day(s)</span>
        </div>
      )}

      {requestType && (
        <div className="flex flex-col gap-1">
          <ItemDescription>Type</ItemDescription>
          <span className="capitalize">{requestType.replace('_', ' ')}</span>
        </div>
      )}

      {reason && (
        <div className="flex flex-col gap-1">
          <ItemDescription>Reason</ItemDescription>
          <span>{reason}</span>
        </div>
      )}
    </>
  )
}
