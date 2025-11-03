'use client'

import { DollarSign, Calendar, Users, Award } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Total Revenue</ItemTitle>
          <ItemActions>
            <DollarSign className="size-4 text-muted-foreground" aria-hidden />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold">{formatCurrency(metrics.total_revenue)}</p>
          <ItemDescription>
            {formatCurrency(metrics.avg_appointment_value)} avg per appointment
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Estimated Commission</ItemTitle>
          <ItemActions>
            <Award className="size-4 text-primary" aria-hidden />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold">{formatCurrency(earnings.estimated_commission)}</p>
          <ItemDescription>
            {earnings.commission_rate}% commission rate
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Appointments</ItemTitle>
          <ItemActions>
            <Calendar className="size-4 text-muted-foreground" aria-hidden />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold">{metrics.completed_appointments}</p>
          <ItemDescription>
            {metrics.total_appointments} total ({formatPercentage(metrics.completion_rate)} completion)
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-2">
        <ItemHeader>
          <ItemTitle>Customers</ItemTitle>
          <ItemActions>
            <Users className="size-4 text-muted-foreground" aria-hidden />
          </ItemActions>
        </ItemHeader>
        <ItemContent>
          <p className="text-2xl font-semibold">{metrics.unique_customers}</p>
          <ItemDescription>
            {metrics.repeat_customers} repeat customers
          </ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
