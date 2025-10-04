'use client'

import { useState } from 'react'
import { Star, Flag, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Stack, Flex, Grid } from '@/components/layout'
import { H3, P, Muted, Small } from '@/components/ui/typography'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { respondToReview, flagReview, toggleFeaturedReview } from '../api/mutations'
import type { SalonReviewWithDetails } from '../api/queries'

type ReviewsListProps = {
  reviews: SalonReviewWithDetails[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  // Filter out reviews with null IDs
  const validReviews = reviews.filter(r => r.id !== null)

  const [selectedReview, setSelectedReview] = useState<SalonReviewWithDetails | null>(null)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flaggingReview, setFlaggingReview] = useState<string | null>(null)

  const handleRespond = async () => {
    if (!selectedReview || !selectedReview.id || !response.trim()) return

    setIsSubmitting(true)
    const result = await respondToReview(selectedReview.id, response.trim())
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Response posted successfully')
      setSelectedReview(null)
      setResponse('')
    } else {
      toast.error(result.error)
    }
  }

  const handleFlag = async () => {
    if (!flaggingReview || !flagReason.trim()) return

    setIsSubmitting(true)
    const result = await flagReview(flaggingReview, flagReason.trim())
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Review flagged for moderation')
      setShowFlagDialog(false)
      setFlaggingReview(null)
      setFlagReason('')
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleFeatured = async (reviewId: string, featured: boolean) => {
    const result = await toggleFeaturedReview(reviewId, featured)
    if (result.success) {
      toast.success(featured ? 'Review featured' : 'Review unfeatured')
    } else {
      toast.error(result.error)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const renderStars = (rating: number | null) => {
    const stars = rating || 0
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Stack gap="md">
        {validReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Muted>No reviews yet</Muted>
          </Card>
        ) : (
          validReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <Flex justify="between" align="start">
                  <Stack gap="sm">
                    <Flex gap="sm" align="center">
                      <H3 className="text-base">{review.customer_name || 'Anonymous'}</H3>
                      {review.is_verified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {review.is_featured && (
                        <Badge variant="default" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {review.is_flagged && (
                        <Badge variant="destructive" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </Flex>
                    <Flex gap="md" align="center">
                      {renderStars(review.rating)}
                      <Small className="text-muted-foreground">{formatDate(review.created_at)}</Small>
                    </Flex>
                  </Stack>

                  <Flex gap="sm">
                    {!review.response && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReview(review)
                          setResponse(review.response || '')
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    )}
                    {!review.is_flagged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setFlaggingReview(review.id)
                          setShowFlagDialog(true)
                        }}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => review.id && handleToggleFeatured(review.id, !review.is_featured)}
                    >
                      <TrendingUp className={`h-4 w-4 ${review.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardContent>
                <Stack gap="md">
                  {review.title && <P className="font-medium">{review.title}</P>}
                  {review.comment && <P className="text-sm">{review.comment}</P>}

                  {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
                    <Grid cols={{ base: 1, md: 3 }} gap="sm">
                      {review.service_quality_rating && (
                        <div>
                          <Muted className="text-xs">Service Quality</Muted>
                          {renderStars(review.service_quality_rating)}
                        </div>
                      )}
                      {review.cleanliness_rating && (
                        <div>
                          <Muted className="text-xs">Cleanliness</Muted>
                          {renderStars(review.cleanliness_rating)}
                        </div>
                      )}
                      {review.value_rating && (
                        <div>
                          <Muted className="text-xs">Value</Muted>
                          {renderStars(review.value_rating)}
                        </div>
                      )}
                    </Grid>
                  )}

                  {review.response && (
                    <Card className="bg-muted/50 border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <Stack gap="sm">
                          <Flex justify="between">
                            <Small className="font-medium">Response from salon</Small>
                            <Small className="text-muted-foreground">{formatDate(review.response_date)}</Small>
                          </Flex>
                          <P className="text-sm">{review.response}</P>
                          {review.responded_by_name && (
                            <Muted className="text-xs">- {review.responded_by_name}</Muted>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Response Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <Stack gap="md">
            {selectedReview && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <Stack gap="sm">
                    <Flex gap="sm" align="center">
                      <P className="font-medium">{selectedReview.customer_name || 'Anonymous'}</P>
                      {renderStars(selectedReview.rating)}
                    </Flex>
                    {selectedReview.comment && <P className="text-sm">{selectedReview.comment}</P>}
                  </Stack>
                </CardContent>
              </Card>
            )}
            <Textarea
              placeholder="Type your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
            />
          </Stack>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleRespond} disabled={isSubmitting || !response.trim()}>
              {isSubmitting ? 'Posting...' : 'Post Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Review</DialogTitle>
          </DialogHeader>
          <Stack gap="md">
            <Textarea
              placeholder="Reason for flagging (e.g., inappropriate content, spam, fake review)..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              rows={4}
            />
          </Stack>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFlag} disabled={isSubmitting || !flagReason.trim()}>
              {isSubmitting ? 'Flagging...' : 'Flag Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
