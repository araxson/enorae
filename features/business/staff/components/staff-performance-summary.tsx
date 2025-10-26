'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, TrendingUp } from 'lucide-react'
import type { StaffWithServices } from '@/features/business/staff/api/queries'

interface StaffPerformanceSummaryProps {
  staff: StaffWithServices[]
}

export function StaffPerformanceSummary({ staff }: StaffPerformanceSummaryProps) {
  // Calculate performance metrics
  const staffWithMetrics = staff
    .map((member) => {
      // Note: performed_count and rating_count are not available in the staff_services view
      // We count available services as a proxy for activity
      const performedServices = member.services.filter((service) => service.is_available === true)
      const servicesWithRatings = member.services.filter(
        (service) => typeof service.rating_average === 'number' && service.rating_average > 0
      )
      const avgRating =
        servicesWithRatings.length > 0
          ? servicesWithRatings.reduce(
              (sum, service) => sum + (service.rating_average ?? 0),
              0
            ) / servicesWithRatings.length
          : 0

      return {
        ...member,
        totalPerformed: performedServices.length,
        avgRating,
        totalRatings: servicesWithRatings.length,
      }
    })
    .filter((m) => m.totalPerformed > 0 || m.avgRating > 0)

  // Top performers
  const topPerformer = staffWithMetrics.reduce(
    (max, member) => (member.totalPerformed > (max?.totalPerformed ?? 0) ? member : max),
    staffWithMetrics[0]
  )

  const topRated = staffWithMetrics.reduce(
    (max, member) => (member.avgRating > (max?.avgRating ?? 0) ? member : max),
    staffWithMetrics[0]
  )

  if (staffWithMetrics.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Top Performer by Volume */}
      {topPerformer && topPerformer.totalPerformed > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle>Top Performer by Volume</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Avatar className="h-12 w-12">
                {topPerformer['avatar_url'] && (
                  <AvatarImage src={topPerformer['avatar_url']} alt={topPerformer['full_name'] || 'Staff'} />
                )}
                <AvatarFallback>
                  {topPerformer['full_name']?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 flex-1">
                <p className="leading-7 font-semibold">{topPerformer['full_name'] || 'Staff Member'}</p>
                {topPerformer['title'] && <p className="text-sm text-muted-foreground">{topPerformer['title']}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">
                    <span className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      {topPerformer.totalPerformed} services performed
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Rated */}
      {topRated && topRated.avgRating > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" fill="currentColor" />
              <CardTitle>Top Rated Staff Member</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Avatar className="h-12 w-12">
                {topRated['avatar_url'] && (
                  <AvatarImage src={topRated['avatar_url']} alt={topRated['full_name'] || 'Staff'} />
                )}
                <AvatarFallback>
                  {topRated['full_name']?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 flex-1">
                <p className="leading-7 font-semibold">{topRated['full_name'] || 'Staff Member'}</p>
                {topRated['title'] && <p className="text-sm text-muted-foreground">{topRated['title']}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-white" />
                      {topRated.avgRating.toFixed(1)} average rating
                    </span>
                  </Badge>
                  <p className="text-sm text-muted-foreground">({topRated.totalRatings} reviews)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
