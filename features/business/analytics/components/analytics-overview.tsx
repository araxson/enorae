import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AnalyticsOverview } from '../api/queries'

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
      iconColor: 'text-success',
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
      iconColor: 'text-info',
      subtitle: `${data.customers.new} new, ${data.customers.returning} returning`,
      detail: `${formatPercent(data.customers.retentionRate)} retention rate`,
    },
    {
      title: 'Active Staff',
      value: data.staff.active.toString(),
      icon: UserCheck,
      iconColor: 'text-warning',
      subtitle: 'Team members',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <div className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{card.value}</h3>
                {card.trend !== undefined && (
                  <Badge variant={card.trend >= 0 ? 'default' : 'destructive'}>
                    {card.trend >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercent(Math.abs(card.trend))}
                  </Badge>
                )}
              </div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              )}
              {card.detail && (
                <p className="text-xs text-muted-foreground">{card.detail}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
