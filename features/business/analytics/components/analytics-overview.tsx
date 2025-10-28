import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import type { AnalyticsOverview } from '@/features/business/analytics/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Calendar, DollarSign, TrendingDown, TrendingUp, UserCheck, Users } from 'lucide-react'

type AnalyticsOverviewProps = {
  data: AnalyticsOverview
}

export function AnalyticsOverviewCards({ data }: AnalyticsOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.revenue.total),
      icon: DollarSign,
      iconColor: 'text-primary',
      subtitle: `Service: ${formatCurrency(data.revenue.service)} | Product: ${formatCurrency(data.revenue.product)}`,
      trend: data.revenue.growth,
    },
    {
      title: 'Appointments',
      value: data.appointments.total.toString(),
      icon: Calendar,
      iconColor: 'text-primary',
      subtitle: `${formatPercent(data.appointments.completionRate)} completion rate`,
      detail: `${data.appointments.completed} completed, ${data.appointments.cancelled} cancelled`,
    },
    {
      title: 'Customers',
      value: data.customers.total.toString(),
      icon: Users,
      iconColor: 'text-secondary',
      subtitle: `${data.customers.new} new, ${data.customers.returning} returning`,
      detail: `${formatPercent(data.customers.retentionRate)} retention rate`,
    },
    {
      title: 'Active Staff',
      value: data.staff.active.toString(),
      icon: UserCheck,
      iconColor: 'text-accent',
      subtitle: 'Team members',
    },
  ]

  return (
    <ItemGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Item key={card.title} variant="outline" className="flex-col gap-3">
          <ItemHeader className="items-start">
            <ItemTitle>{card.title}</ItemTitle>
            <ItemActions className="flex-none">
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </ItemActions>
          </ItemHeader>
          <ItemContent className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <CardTitle>{card.value}</CardTitle>
              {card.trend !== undefined && (
                <Badge variant={card.trend >= 0 ? 'default' : 'destructive'}>
                  {card.trend >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {formatPercent(Math.abs(card.trend))}
                </Badge>
              )}
            </div>
            {card.subtitle ? <ItemDescription>{card.subtitle}</ItemDescription> : null}
            {card.detail ? <ItemDescription>{card.detail}</ItemDescription> : null}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
