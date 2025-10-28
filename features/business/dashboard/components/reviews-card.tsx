'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Star, MessageSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item'

import type { BusinessReviewStats } from '@/features/business/dashboard/types'

type ReviewsCardProps = {
  stats: BusinessReviewStats
}

export function ReviewsCard({ stats }: ReviewsCardProps) {
  const ratingValueClass = 'text-2xl font-semibold leading-none tracking-tight'

  if (stats.totalReviews === 0) {
    return (
      <Item variant="outline">
        <ItemHeader>
          <ItemContent>
            <div className="flex items-center gap-2">
              <Star className="size-5" />
              <ItemTitle>Customer Reviews</ItemTitle>
            </div>
          </ItemContent>
        </ItemHeader>
        <ItemContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Reviews from customers will appear here.</EmptyDescription>
            </EmptyHeader>
            <Button asChild variant="outline">
              <Link href="/business/reviews">Manage Reviews</Link>
            </Button>
          </Empty>
        </ItemContent>
      </Item>
    )
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemContent>
          <div className="flex items-center gap-2">
            <Star className="size-5" />
            <ItemTitle>Customer Reviews</ItemTitle>
          </div>
        </ItemContent>
        <ItemActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="sm">
                <Link href="/business/reviews">View all</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open review inbox</TooltipContent>
          </Tooltip>
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Average Rating */}
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Average rating</FieldLabel>
              <FieldContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <p className={ratingValueClass}>{stats.averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => {
                        const isFilled = i < Math.round(stats.averageRating)
                        return (
                          <Star
                            key={i}
                            className={`size-4 ${isFilled ? 'text-primary' : 'text-muted-foreground'}`}
                            fill={isFilled ? 'currentColor' : 'none'}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <FieldDescription>
                    Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            {/* Action Items */}
            <Separator />
            <div className="flex flex-col gap-2">
              {stats.pendingResponses > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Alert>
                      <MessageSquare className="size-4" />
                      <AlertTitle>Responses needed</AlertTitle>
                      <AlertDescription>
                        {stats.pendingResponses}{' '}
                        {stats.pendingResponses === 1 ? 'review requires' : 'reviews require'} a reply
                      </AlertDescription>
                    </Alert>
                  </TooltipTrigger>
                  <TooltipContent>Follow up to protect guest satisfaction</TooltipContent>
                </Tooltip>
              )}
              {stats.flaggedCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Alert variant="destructive">
                      <AlertTriangle className="size-4" />
                      <AlertTitle>Flagged reviews</AlertTitle>
                      <AlertDescription>
                        {stats.flaggedCount}{' '}
                        {stats.flaggedCount === 1 ? 'review needs' : 'reviews need'} investigation
                      </AlertDescription>
                    </Alert>
                  </TooltipTrigger>
                  <TooltipContent>Investigate and resolve policy concerns</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex flex-col gap-2">
            <FieldLabel>Rating distribution</FieldLabel>
            <div className="space-y-2">
              <ItemGroup>
                {stats.ratingDistribution.map(({ rating, count }) => {
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                  return (
                    <Item key={rating}>
                      <ItemContent>
                        <div className="flex items-center gap-2">
                          <ItemTitle>{rating} stars</ItemTitle>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </div>
                      </ItemContent>
                      <ItemActions>
                        <ItemDescription>{count}</ItemDescription>
                      </ItemActions>
                    </Item>
                  )
                })}
              </ItemGroup>
            </div>
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
