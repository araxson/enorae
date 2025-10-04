import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, Stack, Flex, Box, Group } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
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
      iconColor: 'text-green-500',
      subtitle: `Service: ${formatCurrency(data.revenue.service)} | Product: ${formatCurrency(data.revenue.product)}`,
      trend: data.revenue.growth,
    },
    {
      title: 'Appointments',
      value: data.appointments.total.toString(),
      icon: Calendar,
      iconColor: 'text-blue-500',
      subtitle: `${formatPercent(data.appointments.completionRate)} completion rate`,
      detail: `${data.appointments.completed} completed, ${data.appointments.cancelled} cancelled`,
    },
    {
      title: 'Customers',
      value: data.customers.total.toString(),
      icon: Users,
      iconColor: 'text-purple-500',
      subtitle: `${data.customers.new} new, ${data.customers.returning} returning`,
      detail: `${formatPercent(data.customers.retentionRate)} retention rate`,
    },
    {
      title: 'Active Staff',
      value: data.staff.active.toString(),
      icon: UserCheck,
      iconColor: 'text-orange-500',
      subtitle: 'Team members',
    },
  ]

  return (
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <Box pb="xs">
              <Flex align="center" justify="between">
                <CardTitle className="text-sm text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </Flex>
            </Box>
          </CardHeader>
          <CardContent>
            <Stack gap="xs">
              <Group gap="xs" align="baseline">
                <H3>{card.value}</H3>
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
              </Group>
              {card.subtitle && (
                <Muted className="text-xs">{card.subtitle}</Muted>
              )}
              {card.detail && (
                <Muted className="text-xs">{card.detail}</Muted>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Grid>
  )
}
