import { Alert, AlertDescription } from '@/components/ui/alert'
import { TimeOffRequestCard } from './components/time-off-request-card'
import { getSalonTimeOffRequests, getPendingSalonTimeOffRequests } from './api/queries'
import { approveTimeOffRequest, rejectTimeOffRequest } from './api/mutations'

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
          <div className="rounded-lg bg-secondary/10 p-4 border">
            <small className="text-sm font-medium leading-none font-semibold">
              {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''} need review
            </small>
          </div>
        )}

        {allRequests.length === 0 ? (
          <Alert>
            <AlertDescription>No time-off requests found</AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allRequests.map((request) => (
              <TimeOffRequestCard
                key={request.id}
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
