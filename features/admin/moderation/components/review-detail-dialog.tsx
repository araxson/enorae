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
import { Stack, Flex } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { toast } from 'sonner'
import { respondToReview } from '../api/mutations'

type Review = {
  id: string
  salon_name?: string | null
  customer_name?: string | null
  customer_email?: string | null
  rating: number
  review_text?: string | null
  is_flagged: boolean
  flagged_reason?: string | null
  response?: string | null
  response_date?: string | null
  is_featured: boolean
  created_at: string
}

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
    if (!review || !responseText.trim()) {
      toast.error('Response cannot be empty')
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
    } else {
      toast.success('Your response has been added to the review.')
      setIsResponding(false)
      setResponseText('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <Stack gap="lg">
          {/* Salon & Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Muted className="text-sm">Salon</Muted>
              <P className="font-medium">{review.salon_name || 'Unknown'}</P>
            </div>
            <div>
              <Muted className="text-sm">Customer</Muted>
              <P className="font-medium">{review.customer_name || 'Anonymous'}</P>
              <Muted className="text-xs">{review.customer_email}</Muted>
            </div>
          </div>

          {/* Rating & Status */}
          <div>
            <Muted className="text-sm mb-2">Rating & Status</Muted>
            <Flex gap="sm" align="center">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{review.rating}</span>
              </div>
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
              {review.response && (
                <Badge variant="outline" className="gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Responded
                </Badge>
              )}
            </Flex>
          </div>

          {/* Flagged Reason */}
          {review.is_flagged && review.flagged_reason && (
            <div>
              <Muted className="text-sm mb-1">Flag Reason</Muted>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <P className="text-sm text-red-900">{review.flagged_reason}</P>
              </div>
            </div>
          )}

          {/* Review Text */}
          <div>
            <Muted className="text-sm mb-1">Review</Muted>
            <div className="p-3 bg-muted rounded-md">
              <P className="text-sm">{review.review_text || 'No text provided'}</P>
            </div>
            <Muted className="text-xs mt-1">
              Posted on {format(new Date(review.created_at), 'MMMM d, yyyy')}
            </Muted>
          </div>

          {/* Existing Response */}
          {review.response && (
            <div>
              <Muted className="text-sm mb-1">Response</Muted>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <P className="text-sm text-blue-900">{review.response}</P>
              </div>
              {review.response_date && (
                <Muted className="text-xs mt-1">
                  Responded on {format(new Date(review.response_date), 'MMMM d, yyyy')}
                </Muted>
              )}
            </div>
          )}

          {/* Response Form */}
          {!isResponding && !review.response && (
            <Button onClick={() => setIsResponding(true)} variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Response
            </Button>
          )}

          {isResponding && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  placeholder="Enter your response to this review..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
                <Muted className="text-xs mt-1">
                  {responseText.length}/1000 characters
                </Muted>
              </div>
              <Flex gap="sm" justify="end">
                <Button
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
                  {isLoading ? 'Submitting...' : 'Submit Response'}
                </Button>
              </Flex>
            </div>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
