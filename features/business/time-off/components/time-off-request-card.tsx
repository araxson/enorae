'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Stack, Flex } from '@/components/layout'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'

type TimeOffRequest = Database['public']['Views']['time_off_requests_view']['Row']

interface TimeOffRequestCardProps {
  request: TimeOffRequest
  onApprove: (id: string, notes?: string) => Promise<{ success?: boolean; error?: string }>
  onReject: (id: string, notes: string) => Promise<{ success?: boolean; error?: string }>
}

export function TimeOffRequestCard({ request, onApprove, onReject }: TimeOffRequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')

  const handleApprove = async () => {
    if (!request.id) return
    setIsProcessing(true)
    const result = await onApprove(request.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Request approved')
    }
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!request.id || !rejectNotes.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    setIsProcessing(true)
    const result = await onReject(request.id, rejectNotes)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Request rejected')
      setShowRejectForm(false)
      setRejectNotes('')
    }
    setIsProcessing(false)
  }

  const statusColor =
    request.status === 'approved'
      ? 'default'
      : request.status === 'rejected'
      ? 'destructive'
      : 'secondary'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <CardTitle>{request.staff_name || 'Unknown Staff'}</CardTitle>
            </div>
            {request.staff_title && (
              <p className="text-sm text-muted-foreground text-sm">{request.staff_title}</p>
            )}
          </div>
          <Badge variant={statusColor}>{request.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Start Date</small>
              <p className="leading-7 text-sm font-medium">
                {request.start_at ? format(new Date(request.start_at), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <small className="text-sm font-medium leading-none text-muted-foreground">End Date</small>
              <p className="leading-7 text-sm font-medium">
                {request.end_at ? format(new Date(request.end_at), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>

          {request.duration_days && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{request.duration_days} day(s)</span>
            </div>
          )}

          {request.request_type && (
            <div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Type</small>
              <p className="leading-7 text-sm capitalize">{request.request_type.replace('_', ' ')}</p>
            </div>
          )}

          {request.reason && (
            <div>
              <small className="text-sm font-medium leading-none text-muted-foreground">Reason</small>
              <p className="leading-7 text-sm">{request.reason}</p>
            </div>
          )}

          {request.reviewed_at && request.reviewed_by_name && (
            <div className="pt-2 border-t">
              <small className="text-sm font-medium leading-none text-muted-foreground">
                Reviewed by {request.reviewed_by_name} on{' '}
                {format(new Date(request.reviewed_at), 'MMM dd, yyyy')}
              </small>
              {request.review_notes && (
                <p className="leading-7 text-sm mt-1">{request.review_notes}</p>
              )}
            </div>
          )}

          {request.status === 'pending' && (
            <div className="pt-2 border-t">
              {!showRejectForm ? (
                <Flex gap="sm">
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    disabled={isProcessing}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    disabled={isProcessing}
                  >
                    Reject
                  </Button>
                </Flex>
              ) : (
                <Stack gap="sm">
                  <Textarea
                    placeholder="Reason for rejection..."
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    rows={3}
                  />
                  <Flex gap="sm">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !rejectNotes.trim()}
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectNotes('')
                      }}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Stack>
              )}
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
