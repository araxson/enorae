'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Plus } from 'lucide-react'
import { RequestCard } from './request-card'
import type { TimeOffRequestWithStaff } from '@/features/staff/time-off/api/queries'

interface RequestsListTabProps {
  displayedRequests: TimeOffRequestWithStaff[]
  pendingRequests: TimeOffRequestWithStaff[]
  showPendingAlert: boolean
  onCreateClick: () => void
}

export function RequestsListTab({
  displayedRequests,
  pendingRequests,
  showPendingAlert,
  onCreateClick,
}: RequestsListTabProps) {
  return (
    <>
      {showPendingAlert && pendingRequests.length > 0 && (
        <Alert>
          <AlertTitle>{pendingRequests.length} pending request(s)</AlertTitle>
          <AlertDescription>Awaiting review</AlertDescription>
        </Alert>
      )}

      {displayedRequests.length === 0 ? (
        <Card>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No time-off requests yet</EmptyTitle>
                <EmptyDescription>Click the New request button to submit a time-off request.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={onCreateClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  New request
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {displayedRequests.map((request) => (
            <RequestCard key={request['id']} request={request} isStaffView />
          ))}
        </div>
      )}
    </>
  )
}
