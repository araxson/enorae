'use client'

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

import type { BusinessReviewStats } from '../types'

type ReviewsCardProps = {
  stats: BusinessReviewStats
}

export function ReviewsCard({ stats }: ReviewsCardProps) {
  if (stats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <CardTitle>Customer Reviews</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No reviews yet. Reviews from customers will appear here.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/business/reviews">Manage Reviews</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText>
            <span className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <CardTitle>Customer Reviews</CardTitle>
            </span>
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
                        className={`h-4 w-4 ${isFilled ? 'text-accent' : 'text-muted-foreground'}`}
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
                    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium">
                        <Badge variant="outline" className="ml-1">
                          {stats.pendingResponses}
                        </Badge>{' '}
                        {stats.pendingResponses === 1 ? 'review needs' : 'reviews need'} response
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Follow up to protect guest satisfaction</TooltipContent>
                </Tooltip>
              )}
              {stats.flaggedCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-medium">
                        <Badge variant="destructive" className="ml-1">
                          {stats.flaggedCount}
                        </Badge>{' '}
                        flagged {stats.flaggedCount === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
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
