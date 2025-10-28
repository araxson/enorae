import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Calendar, Award } from 'lucide-react'
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
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</div>
            <span className="rounded-full bg-muted p-2">
              <DollarSign className="size-4 text-muted-foreground" aria-hidden />
            </span>
          </div>
          <p className="text-muted-foreground block text-xs">
            {formatCurrency(metrics.avg_appointment_value)} avg per appointment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Commission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">{formatCurrency(earnings.estimated_commission)}</div>
            <span className="rounded-full bg-muted p-2">
              <Award className="size-4 text-primary" aria-hidden />
            </span>
          </div>
          <p className="text-muted-foreground block text-xs">
            {earnings.commission_rate}% commission rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">{metrics.completed_appointments}</div>
            <span className="rounded-full bg-muted p-2">
              <Calendar className="size-4 text-muted-foreground" aria-hidden />
            </span>
          </div>
          <p className="text-muted-foreground block text-xs">
            {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold">{metrics.unique_customers}</div>
            <span className="rounded-full bg-muted p-2">
              <Users className="size-4 text-muted-foreground" aria-hidden />
            </span>
          </div>
          <p className="text-muted-foreground block text-xs">
            {metrics.repeat_customers} repeat customers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
