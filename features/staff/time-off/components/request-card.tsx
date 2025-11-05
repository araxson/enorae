'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  approveTimeOffRequest,
  rejectTimeOffRequest,
  updateTimeOffRequest,
  cancelTimeOffRequest
} from '@/features/staff/time-off/api/mutations'
import type { TimeOffRequestWithStaff } from '@/features/staff/time-off/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { RequestActions } from './request-actions'

interface RequestCardProps {
  request: TimeOffRequestWithStaff
  isStaffView?: boolean // true if viewing as staff member (not manager)
}

export function RequestCard({ request, isStaffView = false }: RequestCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState({
    startAt: request['start_at'] || '',
    endAt: request['end_at'] || '',
    requestType: request['request_type'] || 'vacation',
    reason: request['reason'] || '',
  })

  const handleApprove = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request['id'] || '')
      await approveTimeOffRequest(formData)
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request['id'] || '')
      await rejectTimeOffRequest(formData)
    })
  }

  const handleUpdate = (data: { startAt: string; endAt: string; requestType: string; reason: string }) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request['id'] || '')
      formData.append('startAt', data.startAt)
      formData.append('endAt', data.endAt)
      formData.append('requestType', data.requestType)
      formData.append('reason', data.reason)
      await updateTimeOffRequest(formData)
      setIsEditOpen(false)
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request['id'] || '')
      await cancelTimeOffRequest(formData)
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatStatus = (status: string) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{request.staff?.profiles?.['username'] || 'Staff member'}</CardTitle>
            <CardDescription>
              {request['request_type']?.replace('_', ' ').toUpperCase() || 'N/A'}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(request['status'] || '')}>
            {request['status'] ? formatStatus(request['status']) : 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ItemGroup className="space-y-2">
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>From</ItemTitle>
                <ItemDescription>
                  {request['start_at'] ? new Date(request['start_at']).toLocaleDateString() : '—'}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>To</ItemTitle>
                <ItemDescription>
                  {request['end_at'] ? new Date(request['end_at']).toLocaleDateString() : '—'}
                </ItemDescription>
              </ItemContent>
            </Item>
            {request['reason'] ? (
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>Reason</ItemTitle>
                  <ItemDescription>{request['reason']}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>

          <RequestActions
            status={request['status'] || ''}
            isStaffView={isStaffView}
            isPending={isPending}
            editDialogOpen={isEditOpen}
            onEditDialogChange={setIsEditOpen}
            startAt={editData.startAt}
            endAt={editData.endAt}
            requestType={editData.requestType}
            reason={editData.reason}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </CardContent>
    </Card>
  )
}
