'use client'

import { CheckCircle2, Flag, MessageSquare, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flex, Grid, Stack } from '@/components/layout'
import type { NormalizedReview } from './use-reviews-list'

type ReviewCardProps = {
  review: NormalizedReview
  onRespond: (review: NormalizedReview) => void
  onFlag: (reviewId: string) => void
  onToggleFeatured: (reviewId: string, featured: boolean) => Promise<void>
}

export function ReviewCard({ review, onRespond, onFlag, onToggleFeatured }: ReviewCardProps) {
  const renderStars = (rating: number | null) => {
    const stars = rating || 0
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon key={index} filled={index < stars} />
        ))}
      </div>
    )
  }

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <Flex justify="between" align="start">
          <Stack gap="sm">
            <Flex gap="sm" align="center">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-base">{review.customer_name || 'Anonymous'}</h3>
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
              <small className="text-sm font-medium leading-none text-muted-foreground">{formatDate(review.created_at)}</small>
            </Flex>
          </Stack>

          <Flex gap="sm">
            {!review.response && (
              <Button size="sm" variant="outline" onClick={() => onRespond(review)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Respond
              </Button>
            )}
            {!review.is_flagged && (
              <Button size="sm" variant="ghost" onClick={() => onFlag(review.id)}>
                <Flag className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await onToggleFeatured(review.id, !review.is_featured)
                toast.success(!review.is_featured ? 'Review featured' : 'Review unfeatured')
              }}
            >
              <TrendingUp className={`h-4 w-4 ${review.is_featured ? 'fill-current' : ''}`} />
            </Button>
          </Flex>
        </Flex>
      </CardHeader>

      <CardContent>
        <Stack gap="md">
          {review.title && <p className="leading-7 font-medium">{review.title}</p>}
          {review.comment && <p className="leading-7 text-sm">{review.comment}</p>}

          {(review.service_quality_rating || review.cleanliness_rating || review.value_rating) && (
            <Grid cols={{ base: 1, md: 3 }} gap="sm">
              {review.service_quality_rating && (
                <RatingItem label="Service Quality" rating={review.service_quality_rating} />
              )}
              {review.cleanliness_rating && (
                <RatingItem label="Cleanliness" rating={review.cleanliness_rating} />
              )}
              {review.value_rating && <RatingItem label="Value" rating={review.value_rating} />}
            </Grid>
          )}

          {review.response && (
            <Card>
              <CardHeader>
                <Flex justify="between" align="center">
                  <div>
                    <CardTitle>Response from salon</CardTitle>
                    {review.responded_by_name ? (
                      <CardDescription>By {review.responded_by_name}</CardDescription>
                    ) : null}
                  </div>
                  <CardDescription>{formatDate(review.response_date)}</CardDescription>
                </Flex>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-sm">{review.response}</p>
              </CardContent>
            </Card>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

type RatingItemProps = {
  label: string
  rating: number | null
}

function RatingItem({ label, rating }: RatingItemProps) {
  const stars = rating || 0
  return (
    <div>
      <p className="text-sm text-muted-foreground text-xs">{label}</p>
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon key={index} filled={index < stars} />
        ))}
      </div>
    </div>
  )
}

type StarIconProps = {
  filled: boolean
}

function StarIcon({ filled }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${filled ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
