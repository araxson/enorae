import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { CalendarDays } from 'lucide-react'
import { TimeOffRequestCard } from './time-off-request-card'
import { getSalonTimeOffRequests, getPendingSalonTimeOffRequests } from '../api/queries'
import { approveTimeOffRequest, rejectTimeOffRequest } from '../api/mutations'

export async function BusinessTimeOff() {
  let allRequests, pendingRequests

  try {
    ;[allRequests, pendingRequests] = await Promise.all([
      getSalonTimeOffRequests(),
      getPendingSalonTimeOffRequests(),
    ])
  } catch (error) {
    return (
      <section className="py-10 mx-auto w-full px-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertTitle>Failed to load requests</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load time-off requests'}
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        {pendingRequests.length > 0 && (
          <Alert>
            <AlertTitle>Pending approvals</AlertTitle>
            <AlertDescription>
              {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''} need review
            </AlertDescription>
          </Alert>
        )}

        {allRequests.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No requests</EmptyTitle>
              <EmptyDescription>No time-off requests found</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allRequests.map((request) => (
              <TimeOffRequestCard
                key={request['id']}
                request={request}
                onApprove={approveTimeOffRequest}
                onReject={rejectTimeOffRequest}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
