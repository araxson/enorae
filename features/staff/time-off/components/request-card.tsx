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
} from '../api/mutations'
import type { TimeOffRequestWithStaff } from '../api/queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RequestCardProps {
  request: TimeOffRequestWithStaff
  isStaffView?: boolean // true if viewing as staff member (not manager)
}

export function RequestCard({ request, isStaffView = false }: RequestCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState({
    startAt: request.start_at || '',
    endAt: request.end_at || '',
    requestType: request.request_type || 'vacation',
    reason: request.reason || '',
  })

  const handleApprove = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request.id || '')
      await approveTimeOffRequest(formData)
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request.id || '')
      await rejectTimeOffRequest(formData)
    })
  }

  const handleUpdate = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', request.id || '')
      formData.append('startAt', editData.startAt)
      formData.append('endAt', editData.endAt)
      formData.append('requestType', editData.requestType)
      formData.append('reason', editData.reason)
      await updateTimeOffRequest(formData)
      setIsEditOpen(false)
    })
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this time-off request?')) {
      startTransition(async () => {
        const formData = new FormData()
        formData.append('id', request.id || '')
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

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>{request.staff?.profiles?.username || 'Staff member'}</CardTitle>
          <CardDescription className="capitalize">
            {request.request_type?.replace('_', ' ') || 'N/A'}
          </CardDescription>
        </div>
        <Badge variant={getStatusVariant(request.status || '')} className="capitalize">
          {request.status || 'Unknown'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-1 text-sm">
          <div className="flex gap-2">
            <small className="text-sm font-medium leading-none text-muted-foreground">From:</small>
            <small className="text-sm font-medium leading-none">{request.start_at ? new Date(request.start_at).toLocaleDateString() : '—'}</small>
          </div>
          <div className="flex gap-2">
            <small className="text-sm font-medium leading-none text-muted-foreground">To:</small>
            <small className="text-sm font-medium leading-none">{request.end_at ? new Date(request.end_at).toLocaleDateString() : '—'}</small>
          </div>
          {request.reason && (
            <div className="space-y-1">
              <small className="text-sm font-medium leading-none text-muted-foreground">Reason:</small>
              <small className="text-sm font-medium leading-none">{request.reason}</small>
            </div>
          )}
        </div>

        {isStaffView ? (
          // Staff view: can edit pending requests or cancel any request
          <div className="flex justify-end gap-2">
            {request.status === 'pending' && (
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
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startAt">Start Date</Label>
                      <Input
                        id="startAt"
                        type="date"
                        value={editData.startAt}
                        onChange={(e) => setEditData({ ...editData, startAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endAt">End Date</Label>
                      <Input
                        id="endAt"
                        type="date"
                        value={editData.endAt}
                        onChange={(e) => setEditData({ ...editData, endAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requestType">Type</Label>
                      <Select
                        value={editData.requestType}
                        onValueChange={(value) => setEditData({ ...editData, requestType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick_leave">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        value={editData.reason}
                        onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isPending}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate} disabled={isPending}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {(request.status === 'pending' || request.status === 'approved') && (
              <Button size="sm" variant="destructive" onClick={handleCancel} disabled={isPending}>
                Cancel Request
              </Button>
            )}
          </div>
        ) : (
          // Manager view: can approve/reject
          request.status === 'pending' && (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleReject} disabled={isPending}>
                Reject
              </Button>
              <Button size="sm" onClick={handleApprove} disabled={isPending}>
                Approve
              </Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
