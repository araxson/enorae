'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Grid, Stack, Flex } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import { Star, TrendingUp } from 'lucide-react'
import type { StaffWithServices } from '../api/staff-services-queries'

interface StaffPerformanceSummaryProps {
  staff: StaffWithServices[]
}

export function StaffPerformanceSummary({ staff }: StaffPerformanceSummaryProps) {
  // Calculate performance metrics
  const staffWithMetrics = staff
    .map((member) => {
      const totalPerformed = member.services.reduce((sum, s) => sum + (s.performed_count || 0), 0)
      const servicesWithRatings = member.services.filter((s) => s.rating_average && s.rating_average > 0)
      const avgRating = servicesWithRatings.length > 0
        ? servicesWithRatings.reduce((sum, s) => sum + Number(s.rating_average || 0), 0) / servicesWithRatings.length
        : 0

      return {
        ...member,
        totalPerformed,
        avgRating,
        totalRatings: member.services.reduce((sum, s) => sum + (s.rating_count || 0), 0),
      }
    })
    .filter((m) => m.totalPerformed > 0 || m.avgRating > 0)

  // Top performers
  const topPerformer = staffWithMetrics.reduce(
    (max, member) => (member.totalPerformed > max.totalPerformed ? member : max),
    staffWithMetrics[0]
  )

  const topRated = staffWithMetrics.reduce(
    (max, member) => (member.avgRating > max.avgRating ? member : max),
    staffWithMetrics[0]
  )

  if (staffWithMetrics.length === 0) {
    return null
  }

  return (
    <Grid cols={{ base: 1, md: 2 }} gap="md">
      {/* Top Performer by Volume */}
      {topPerformer && topPerformer.totalPerformed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Top Performer by Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Flex gap="md" align="center">
              <Avatar className="h-12 w-12">
                {topPerformer.avatar_url && (
                  <AvatarImage src={topPerformer.avatar_url} alt={topPerformer.full_name || 'Staff'} />
                )}
                <AvatarFallback>
                  {topPerformer.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <Stack gap="xs" className="flex-1">
                <P className="font-semibold">{topPerformer.full_name || 'Staff Member'}</P>
                {topPerformer.title && <Muted className="text-xs">{topPerformer.title}</Muted>}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {topPerformer.totalPerformed} services performed
                  </Badge>
                </div>
              </Stack>
            </Flex>
          </CardContent>
        </Card>
      )}

      {/* Top Rated */}
      {topRated && topRated.avgRating > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Top Rated Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Flex gap="md" align="center">
              <Avatar className="h-12 w-12">
                {topRated.avatar_url && (
                  <AvatarImage src={topRated.avatar_url} alt={topRated.full_name || 'Staff'} />
                )}
                <AvatarFallback>
                  {topRated.full_name?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <Stack gap="xs" className="flex-1">
                <P className="font-semibold">{topRated.full_name || 'Staff Member'}</P>
                {topRated.title && <Muted className="text-xs">{topRated.title}</Muted>}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    {topRated.avgRating.toFixed(1)} average rating
                  </Badge>
                  <Muted className="text-xs">({topRated.totalRatings} reviews)</Muted>
                </div>
              </Stack>
            </Flex>
          </CardContent>
        </Card>
      )}
    </Grid>
  )
}
