'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  approveTimeOffRequest,
  rejectTimeOffRequest,
  updateTimeOffRequest,
  cancelTimeOffRequest
} from '@/features/staff/time-off/api/mutations'
import type { TimeOffRequestWithStaff } from '@/features/staff/time-off/api/queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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

  const handleUpdate = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request['id'] || '')
      formData.append('startAt', editData.startAt)
      formData.append('endAt', editData.endAt)
      formData.append('requestType', editData.requestType)
      formData.append('reason', editData['reason'])
      await updateTimeOffRequest(formData)
      setIsEditOpen(false)
    })
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this time-off request?')) {
      startTransition(async () => {
        const formData = new FormData()
        formData.append('id', request['id'] || '')
        await cancelTimeOffRequest(formData)
      })
    }
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

          {isStaffView ? (
            // Staff view: can edit pending requests or cancel any request
            <ButtonGroup className="justify-end">
              {request['status'] === 'pending' && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" disabled={isPending}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Time-Off Request</DialogTitle>
                    </DialogHeader>
                    <FieldSet className="space-y-4">
                      <Field>
                        <FieldLabel htmlFor="startAt">Start date</FieldLabel>
                        <FieldContent>
                          <Input
                            id="startAt"
                            type="date"
                            value={editData.startAt}
                            onChange={(e) => setEditData({ ...editData, startAt: e.target.value })}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="endAt">End date</FieldLabel>
                        <FieldContent>
                          <Input
                            id="endAt"
                            type="date"
                            value={editData.endAt}
                            onChange={(e) => setEditData({ ...editData, endAt: e.target.value })}
                          />
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="requestType">Type</FieldLabel>
                        <FieldContent>
                          <Select
                            value={editData.requestType}
                            onValueChange={(value) => setEditData({ ...editData, requestType: value })}
                          >
                            <SelectTrigger id="requestType">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vacation">Vacation</SelectItem>
                              <SelectItem value="sick_leave">Sick Leave</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="reason">Reason</FieldLabel>
                        <FieldContent>
                          <Textarea
                            id="reason"
                            value={editData['reason']}
                            onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                            rows={3}
                          />
                        </FieldContent>
                      </Field>
                      <ButtonGroup className="justify-end">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isPending}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isPending}>
                          Save Changes
                        </Button>
                      </ButtonGroup>
                    </FieldSet>
                  </DialogContent>
                </Dialog>
              )}
              {(request['status'] === 'pending' || request['status'] === 'approved') && (
                <Button size="sm" variant="destructive" onClick={handleCancel} disabled={isPending}>
                  Cancel Request
                </Button>
              )}
            </ButtonGroup>
          ) : (
            // Manager view: can approve/reject
            request['status'] === 'pending' && (
              <ButtonGroup className="justify-end">
                <Button size="sm" variant="outline" onClick={handleReject} disabled={isPending}>
                  Reject
                </Button>
                <Button size="sm" onClick={handleApprove} disabled={isPending}>
                  Approve
                </Button>
              </ButtonGroup>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
