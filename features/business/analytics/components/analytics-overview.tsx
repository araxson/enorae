import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AnalyticsOverview } from '@/features/business/analytics/api/queries'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <ItemGroup>
              <Item>
                <ItemContent>
                  <CardTitle>{card.title}</CardTitle>
                </ItemContent>
                <ItemActions className="flex-none">
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </ItemActions>
              </Item>
            </ItemGroup>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <ItemGroup>
                <Item>
                  <ItemContent className="flex items-baseline gap-2">
                    <div className="text-2xl">{card.value}</div>
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
                  </ItemContent>
                </Item>
              </ItemGroup>
              {card.subtitle ? (
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemDescription className="text-xs text-muted-foreground">
                        {card.subtitle}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              ) : null}
              {card.detail ? (
                <ItemGroup>
                  <Item>
                    <ItemContent>
                      <ItemDescription className="text-xs text-muted-foreground">
                        {card.detail}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
