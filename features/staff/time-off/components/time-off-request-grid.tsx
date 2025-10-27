'use client'

import { CalendarClock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import type { TimeOffRequestWithStaff } from '@/features/staff/time-off/api/queries'
import { RequestCard } from './request-card'

interface TimeOffRequestGridProps {
  displayedRequests: TimeOffRequestWithStaff[]
  pendingCount: number
  showPendingBanner: boolean
  onCreateRequest: () => void
}

export function TimeOffRequestGrid({
  displayedRequests,
  pendingCount,
  showPendingBanner,
  onCreateRequest,
}: TimeOffRequestGridProps) {
  if (displayedRequests.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarClock className="h-8 w-8" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No time-off requests yet</EmptyTitle>
          <EmptyDescription>
            Submit a new request to reserve time away and keep your team informed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonGroup>
            <Button variant="default" onClick={onCreateRequest}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create request
            </Button>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {showPendingBanner && (
        <Alert>
          <AlertTitle>Pending requests</AlertTitle>
          <AlertDescription>
            {pendingCount} pending request(s) awaiting review
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {displayedRequests.map((request) => (
          <RequestCard key={request['id']} request={request} isStaffView />
        ))}
      </div>
    </div>
  )
}
