import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Calendar, Award } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
import type { StaffPerformanceMetrics } from '@/features/staff/analytics/api/queries'
import { formatCurrency, formatPercentage } from './utils'

interface MetricsCardsProps {
  metrics: StaffPerformanceMetrics
  earnings: {
    estimated_commission: number
    commission_rate: number
  }
}

export function MetricsCards({ metrics, earnings }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Total Revenue</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</div>
          <p className="text-muted-foreground block text-xs">
            {formatCurrency(metrics.avg_appointment_value)} avg per appointment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Award className="h-4 w-4 text-primary" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Estimated Commission</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(earnings.estimated_commission)}</div>
          <p className="text-muted-foreground block text-xs">
            {earnings.commission_rate}% commission rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Appointments</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{metrics.completed_appointments}</div>
          <p className="text-muted-foreground block text-xs">
            {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Users className="h-4 w-4 text-muted-foreground" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Customers</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{metrics.unique_customers}</div>
          <p className="text-muted-foreground block text-xs">
            {metrics.repeat_customers} repeat customers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
