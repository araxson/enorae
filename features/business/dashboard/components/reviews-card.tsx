'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Stack, Box, Group, Grid } from '@/components/layout'
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
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="text-center py-8">
            <p className="text-sm text-muted-foreground">No reviews yet. Reviews from customers will appear here.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/business/reviews">Manage Reviews</Link>
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <ButtonGroup className="w-full items-center justify-between">
          <ButtonGroupText className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
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
        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          {/* Average Rating */}
          <Stack gap="md">
            <Box>
              <small className="text-sm font-medium leading-none text-muted-foreground">Average Rating</small>
              <Group gap="xs" className="mt-1 items-baseline">
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <Group gap="xs">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(stats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </Group>
              </Group>
              <small className="text-sm font-medium leading-none text-muted-foreground mt-1">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </small>
            </Box>

            {/* Action Items */}
            <Separator />
            <Stack gap="xs">
              {stats.pendingResponses > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Group gap="xs" className="items-center rounded-md border px-2 py-1">
                      <MessageSquare className="h-4 w-4 text-orange-500" />
                      <small className="text-sm font-medium leading-none">
                        <Badge variant="outline" className="ml-1">
                          {stats.pendingResponses}
                        </Badge>{' '}
                        {stats.pendingResponses === 1 ? 'review needs' : 'reviews need'} response
                      </small>
                    </Group>
                  </TooltipTrigger>
                  <TooltipContent>Follow up to protect guest satisfaction</TooltipContent>
                </Tooltip>
              )}
              {stats.flaggedCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Group gap="xs" className="items-center rounded-md border px-2 py-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <small className="text-sm font-medium leading-none">
                        <Badge variant="destructive" className="ml-1">
                          {stats.flaggedCount}
                        </Badge>{' '}
                        flagged {stats.flaggedCount === 1 ? 'review' : 'reviews'}
                      </small>
                    </Group>
                  </TooltipTrigger>
                  <TooltipContent>Investigate and resolve policy concerns</TooltipContent>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* Rating Distribution */}
          <Stack gap="xs">
            <small className="text-sm font-medium leading-none text-muted-foreground">Rating Distribution</small>
            {stats.ratingDistribution.map(({ rating, count }) => {
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
              return (
                <Group key={rating} gap="xs" className="items-center">
                  <small className="text-sm font-medium leading-none w-12 text-right">{rating} stars</small>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <small className="text-sm font-medium leading-none w-8 text-muted-foreground">{count}</small>
                </Group>
              )
            })}
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  )
}
