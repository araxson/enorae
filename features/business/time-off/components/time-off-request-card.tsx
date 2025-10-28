'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Clock, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    if (!request['id']) return
    setIsProcessing(true)
    const result = await onApprove(request['id'])
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Request approved')
    }
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!request['id'] || !rejectNotes.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    setIsProcessing(true)
    const result = await onReject(request['id'], rejectNotes)
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
    request['status'] === 'approved'
      ? 'default'
      : request['status'] === 'rejected'
      ? 'destructive'
      : 'secondary'

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              <ItemTitle>{request['staff_name'] || 'Unknown Staff'}</ItemTitle>
            </div>
            {request['staff_title'] ? <ItemDescription>{request['staff_title']}</ItemDescription> : null}
          </div>
          <ItemActions>
            <Badge variant={statusColor}>{request['status']}</Badge>
          </ItemActions>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <ItemDescription>Start Date</ItemDescription>
              <span>
                {request['start_at'] ? format(new Date(request['start_at']), 'MMM dd, yyyy') : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <ItemDescription>End Date</ItemDescription>
              <span>
                {request['end_at'] ? format(new Date(request['end_at']), 'MMM dd, yyyy') : 'N/A'}
              </span>
            </div>
          </div>

          {request['duration_days'] ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>{request['duration_days']} day(s)</span>
            </div>
          ) : null}

          {request['request_type'] ? (
            <div className="flex flex-col gap-1">
              <ItemDescription>Type</ItemDescription>
              <span className="capitalize">{request['request_type'].replace('_', ' ')}</span>
            </div>
          ) : null}

          {request['reason'] ? (
            <div className="flex flex-col gap-1">
              <ItemDescription>Reason</ItemDescription>
              <span>{request['reason']}</span>
            </div>
          ) : null}

          {request['reviewed_at'] && request['reviewed_by_name'] ? (
            <>
              <Separator />
              <div className="flex flex-col gap-1">
                <ItemDescription>
                  Reviewed by
                  {' '}
                  {request['reviewed_by_name']}
                  {' '}
                  on
                  {' '}
                  {format(new Date(request['reviewed_at']), 'MMM dd, yyyy')}
                </ItemDescription>
                {request['review_notes'] ? <span>{request['review_notes']}</span> : null}
              </div>
            </>
          ) : null}

          {request['status'] === 'pending' ? (
            <>
              <Separator />
              <div>
                {!showRejectForm ? (
                  <ButtonGroup>
                    <Button size="sm" onClick={handleApprove} disabled={isProcessing}>
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
                  </ButtonGroup>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Textarea
                      placeholder="Reason for rejection..."
                      value={rejectNotes}
                      onChange={(event) => setRejectNotes(event.target.value)}
                      rows={3}
                    />
                    <ButtonGroup>
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
                    </ButtonGroup>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </ItemContent>
    </Item>
  )
}
