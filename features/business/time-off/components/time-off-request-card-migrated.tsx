'use client'

import { useActionState, useState } from 'react'
import { Item, ItemContent } from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { approveTimeOffRequestAction, rejectTimeOffRequestAction } from '../api/mutations'
import { RequestHeader, RequestDetails, ReviewInfo, ActionForms, StatusMessages } from './sections'

type TimeOffRequest = Database['public']['Views']['time_off_requests_view']['Row']

interface TimeOffRequestCardProps {
  request: TimeOffRequest
}

export function TimeOffRequestCard({ request }: TimeOffRequestCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [approveState, approveAction] = useActionState(approveTimeOffRequestAction, null)
  const [rejectState, rejectAction] = useActionState(rejectTimeOffRequestAction, null)

  return (
    <Item variant="outline" className="flex-col gap-4">
      <RequestHeader
        staffName={request['staff_name']}
        staffTitle={request['staff_title']}
        status={request['status']}
      />

      <ItemContent>
        <div className="flex flex-col gap-4">
          <RequestDetails
            startAt={request['start_at']}
            endAt={request['end_at']}
            durationDays={request['duration_days']}
            requestType={request['request_type']}
            reason={request['reason']}
          />

          <ReviewInfo
            reviewedAt={request['reviewed_at']}
            reviewedByName={request['reviewed_by_name']}
            reviewNotes={request['review_notes']}
          />

          <StatusMessages
            approveState={approveState}
            rejectState={rejectState}
          />

          <ActionForms
            status={request['status']}
            requestId={request['id']}
            showRejectForm={showRejectForm}
            setShowRejectForm={setShowRejectForm}
            approveAction={approveAction}
            rejectAction={rejectAction}
            approveSuccess={approveState?.success ?? false}
            rejectSuccess={rejectState?.success ?? false}
            rejectErrors={rejectState?.errors}
          />
        </div>
      </ItemContent>
    </Item>
  )
}
