import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Calendar, Award } from 'lucide-react'
import type { StaffPerformanceMetrics } from '../../api/queries'
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.total_revenue)}</div>
          <p className="text-muted-foreground block text-xs">
            {formatCurrency(metrics.avg_appointment_value)} avg per appointment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Estimated Commission</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(earnings.estimated_commission)}</div>
          <p className="text-muted-foreground block text-xs">
            {earnings.commission_rate}% commission rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.completed_appointments}</div>
          <p className="text-muted-foreground block text-xs">
            {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.unique_customers}</div>
          <p className="text-muted-foreground block text-xs">
            {metrics.repeat_customers} repeat customers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
