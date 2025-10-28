import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Briefcase, Building2, DollarSign, Star, Users } from 'lucide-react'

interface ChainAnalytics {
  totalLocations: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  totalStaff: number
  totalAppointments: number
  totalServices: number
}

interface ChainAnalyticsCardsProps {
  analytics: ChainAnalytics
}

export function ChainAnalyticsCards({ analytics }: ChainAnalyticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Locations</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">{analytics.totalLocations}</p>
          <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">
            ${analytics.totalRevenue.toLocaleString()}
          </p>
          <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
          <CardDescription>{analytics.totalReviews} reviews</CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
          <Star className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Staff</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">{analytics.totalStaff}</p>
          <Users className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">{analytics.totalAppointments}</p>
          <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Services</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-2xl font-bold">{analytics.totalServices}</p>
          <Briefcase className="size-4 text-muted-foreground" aria-hidden="true" />
        </CardContent>
      </Card>
    </div>
  )
}
