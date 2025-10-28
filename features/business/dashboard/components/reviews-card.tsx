'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CardTitle } from '@/components/ui/card'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
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
  if (stats.totalReviews === 0) {
    return (
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader className="items-center gap-2">
          <Star className="h-5 w-5" />
          <ItemTitle>Customer Reviews</ItemTitle>
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
    <Item variant="outline" className="flex-col gap-6">
      <ItemHeader className="gap-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <ItemTitle>Customer Reviews</ItemTitle>
          </ButtonGroupText>
          <ButtonGroupSeparator />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="sm">
                <Link href="/business/reviews">View All</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open review inbox</TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </ItemHeader>
      <ItemContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Average Rating */}
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Average rating</FieldLabel>
              <FieldContent className="gap-2">
                <div className="flex items-baseline gap-2">
                  <CardTitle>{stats.averageRating.toFixed(1)}</CardTitle>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => {
                      const isFilled = i < Math.round(stats.averageRating)
                      return (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${isFilled ? 'text-primary' : 'text-muted-foreground'}`}
                          fill={isFilled ? 'currentColor' : 'none'}
                        />
                      )
                    })}
                  </div>
                </div>
                <FieldDescription>
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </FieldDescription>
              </FieldContent>
            </Field>

            {/* Action Items */}
            <Separator />
            <div className="flex flex-col gap-2">
              {stats.pendingResponses > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Alert>
                      <MessageSquare className="h-4 w-4" />
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
                      <AlertTriangle className="h-4 w-4" />
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
            <ItemGroup className="space-y-2">
              {stats.ratingDistribution.map(({ rating, count }) => {
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                return (
                  <Item key={rating} className="items-center gap-3">
                    <ItemContent className="flex items-center gap-2">
                      <ItemTitle>{rating} stars</ItemTitle>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </ItemContent>
                    <ItemActions className="flex-none">
                      <ItemDescription>{count}</ItemDescription>
                    </ItemActions>
                  </Item>
                )
              })}
            </ItemGroup>
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
