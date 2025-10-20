'use client'

import { Star, MessageSquare, Flag, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Grid, Stack, Flex } from '@/components/layout'
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
    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
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
                      ? 'fill-warning text-warning'
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
          <Stack gap="xs">
            {stats.ratingDistribution.map((dist) => (
              <Flex key={dist.rating} gap="sm" align="center">
                <p className="text-sm text-muted-foreground text-xs w-8">{dist.rating} ★</p>
                <Progress value={(dist.count / maxCount) * 100} className="flex-1 h-2" />
                <p className="text-sm text-muted-foreground text-xs w-8 text-right">{dist.count}</p>
              </Flex>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}
