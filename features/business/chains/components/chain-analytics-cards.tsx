import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
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
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Total Locations</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalLocations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Total Revenue</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Average Rating</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
          <ItemDescription className="text-xs">
            {analytics.totalReviews} reviews
          </ItemDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Total Staff</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalStaff}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Total Appointments</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalAppointments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <ItemGroup>
            <Item className="items-center justify-between gap-2">
              <ItemContent>
                <ItemTitle>Total Services</ItemTitle>
              </ItemContent>
              <ItemMedia variant="icon">
                <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalServices}</div>
        </CardContent>
      </Card>
    </div>
  )
}
