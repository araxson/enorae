'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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

import type { BusinessReviewStats } from '@/features/business/dashboard/types'

type ReviewsCardProps = {
  stats: BusinessReviewStats
}

export function ReviewsCard({ stats }: ReviewsCardProps) {
  if (stats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Reviews from customers will appear here.</EmptyDescription>
            </EmptyHeader>
            <Button asChild variant="outline">
              <Link href="/business/reviews">Manage Reviews</Link>
            </Button>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <CardTitle>Customer Reviews</CardTitle>
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
    </CardHeader>
    <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Average Rating */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
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
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

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
            <p className="text-sm font-medium text-muted-foreground">Rating Distribution</p>
            {stats.ratingDistribution.map(({ rating, count }) => {
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
              return (
                <div key={rating} className="flex items-center gap-2">
                  <p className="text-sm font-medium w-12 text-right">{rating} stars</p>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <p className="text-sm font-medium w-8 text-muted-foreground">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
