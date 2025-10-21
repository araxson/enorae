'use client'

import { Star, MessageSquare, Flag, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  const maxCount = Math.max(...stats.ratingDistribution.map(d => d.count), 1)

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(stats.averageRating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="leading-7 text-xs text-muted-foreground mt-2">{stats.totalReviews} total reviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Pending Responses</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingResponses}</div>
          <p className="leading-7 text-xs text-muted-foreground mt-2">
            {stats.totalReviews > 0
              ? `${Math.round((stats.pendingResponses / stats.totalReviews) * 100)}% of reviews`
              : 'No reviews yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Flagged Reviews</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.flaggedCount}</div>
          <p className="leading-7 text-xs text-muted-foreground mt-2">Require moderation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Rating Distribution</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {stats.ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex gap-3 items-center">
                <p className="text-sm text-muted-foreground text-xs w-8">{dist.rating} ★</p>
                <Progress value={(dist.count / maxCount) * 100} className="flex-1 h-2" />
                <p className="text-sm text-muted-foreground text-xs w-8 text-right">{dist.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
