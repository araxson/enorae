'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemContent, ItemGroup, ItemMedia } from '@/components/ui/item'
import { DollarSign, Calendar, Users, Award } from 'lucide-react'

interface MetricsSummaryProps {
  metrics: {
    total_revenue: number
    avg_appointment_value: number
    completed_appointments: number
    total_appointments: number
    completion_rate: number
    unique_customers: number
    repeat_customers: number
  }
  earnings: {
    estimated_commission: number
    commission_rate: number
  }
}

export function MetricsSummary({ metrics, earnings }: MetricsSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Total Revenue</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(metrics.avg_appointment_value)} avg per appointment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Award className="h-4 w-4 text-primary" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Estimated Commission</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(earnings.estimated_commission)}</div>
          <p className="text-xs text-muted-foreground">
            {earnings.commission_rate}% commission rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Appointments</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{metrics.completed_appointments}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>Customers</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{metrics.unique_customers}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.repeat_customers} repeat customers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
