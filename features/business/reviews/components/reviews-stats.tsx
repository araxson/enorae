'use client'

import { CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Flag, MessageSquare, Star, TrendingUp } from 'lucide-react'
type ReviewsStatsProps = {
  stats: {
    totalReviews: number
    averageRating: number
    ratingDistribution: { rating: number; count: number }[]
    pendingResponses: number
    flaggedCount: number
  }
}

export function ReviewsStats({ stats }: ReviewsStatsProps) {
  const maxCount = Math.max(...stats.ratingDistribution.map((distribution) => distribution.count), 1)

  return (
    <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Average Rating</ItemTitle>
          <ItemMedia variant="icon">
            <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <CardTitle>{stats.averageRating.toFixed(1)}</CardTitle>
              <span className="flex gap-1" aria-hidden="true">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.floor(stats.averageRating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </span>
            </div>
            <ItemDescription aria-live="polite">
              {stats.totalReviews}
              {' '}
              total reviews
            </ItemDescription>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Pending Responses</ItemTitle>
          <ItemMedia variant="icon">
            <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-2">
            <CardTitle>{stats.pendingResponses}</CardTitle>
            <ItemDescription>
              {stats.totalReviews > 0
                ? `${Math.round((stats.pendingResponses / stats.totalReviews) * 100)}% of reviews`
                : 'No reviews yet'}
            </ItemDescription>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Flagged Reviews</ItemTitle>
          <ItemMedia variant="icon">
            <Flag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-2">
            <CardTitle>{stats.flaggedCount}</CardTitle>
            <ItemDescription>Require moderation</ItemDescription>
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-3">
        <ItemHeader>
          <ItemTitle>Rating Distribution</ItemTitle>
          <ItemMedia variant="icon">
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-2">
            {stats.ratingDistribution.map((distribution) => (
              <div key={distribution.rating} className="flex items-center gap-3">
                <span className="w-8 text-xs text-muted-foreground">
                  {distribution.rating}
                  {' '}
                  ★
                </span>
                <Progress value={(distribution.count / maxCount) * 100} className="h-2 flex-1" />
                <span className="w-8 text-right text-xs text-muted-foreground">{distribution.count}</span>
              </div>
            ))}
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
