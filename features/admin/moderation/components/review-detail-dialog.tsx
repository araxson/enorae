'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Star, Flag, MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { P, Muted } from '@/components/ui/typography'
import { toast } from 'sonner'
import { respondToReview } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type Review = Database['public']['Views']['admin_reviews_overview']['Row']

type ReviewDetailDialogProps = {
  review: Review | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewDetailDialog({ review, open, onOpenChange }: ReviewDetailDialogProps) {
  const [isResponding, setIsResponding] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!review) return null

  async function handleSubmitResponse() {
    if (!responseText.trim()) {
      toast.error('Response cannot be empty')
      return
    }

    if (!review.id) {
      toast.error('Invalid review ID')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('reviewId', review.id)
    formData.append('response', responseText)

    const result = await respondToReview(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Your response has been added to the review.')
    setIsResponding(false)
    setResponseText('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Muted className="text-sm">Salon</Muted>
              <P className="font-medium">{review.salon_name || 'Unknown'}</P>
            </div>
            <div className="space-y-1">
              <Muted className="text-sm">Customer</Muted>
              <P className="font-medium">{review.customer_name || 'Anonymous'}</P>
              {review.customer_email && (
                <Muted className="text-xs">{review.customer_email}</Muted>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Muted className="text-sm">Rating & status</Muted>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{review.rating}</span>
              </span>
              {review.is_flagged && (
                <Badge variant="destructive" className="gap-1">
                  <Flag className="h-3 w-3" />
                  Flagged
                </Badge>
              )}
              {review.is_featured && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {review.has_response && (
                <Badge variant="outline" className="gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Responded
                </Badge>
              )}
            </div>
          </div>

          {review.is_flagged && review.flagged_reason && (
            <div className="space-y-1">
              <Muted className="text-sm">Flag reason</Muted>
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                {review.flagged_reason}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Muted className="text-sm">Review</Muted>
            <div className="rounded-md bg-muted p-3 text-sm">
              {review.comment || 'No text provided'}
            </div>
            <Muted className="text-xs">
              Posted on {review.created_at ? format(new Date(review.created_at), 'MMMM d, yyyy') : 'Unknown date'}
            </Muted>
          </div>

          {review.has_response && (
            <div className="space-y-1">
              <Muted className="text-sm">Response</Muted>
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                Response has been recorded. Response content is not available in this overview.
              </div>
              {review.response_date && (
                <Muted className="text-xs">
                  Responded on {format(new Date(review.response_date), 'MMMM d, yyyy')}
                </Muted>
              )}
            </div>
          )}

          {!isResponding && !review.has_response && (
            <Button onClick={() => setIsResponding(true)} variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Add response
            </Button>
          )}

          {isResponding && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="response">Your response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(event) => setResponseText(event.target.value)}
                  placeholder="Enter your response to this review..."
                  rows={4}
                  maxLength={1000}
                />
                <Muted className="text-xs">{responseText.length}/1000 characters</Muted>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResponding(false)
                    setResponseText('')
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitResponse} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit response'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
