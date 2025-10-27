'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Calendar,
  Zap,
} from 'lucide-react'

interface PricingRule {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'discount' | 'surge'
  adjustment_percentage: number
}

interface PricingScenario {
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

interface PricingInsight {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

interface DynamicPricingDashboardProps {
  rules: PricingRule[]
  scenarios: PricingScenario[]
  insights: PricingInsight[]
  services: { id: string }[]
}

export function DynamicPricingDashboard({
  rules,
  scenarios,
  insights,
  services,
}: DynamicPricingDashboardProps) {
  const [selectedDay, setSelectedDay] = useState<string>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatTime = (hour: number) => {
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${suffix}`
  }

  const getDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const filteredScenarios = selectedDay === 'all'
    ? scenarios
    : scenarios.filter(s => s.day === selectedDay)

  const totalPotentialRevenue = insights.reduce(
    (sum, i) => sum + i.potential_revenue_increase,
    0
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <CardDescription>
              {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
              {rules.filter(r => r.adjustment_type === 'discount').length} discounts
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Revenue Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPotentialRevenue)}
            </div>
            <CardDescription>
              Estimated monthly increase
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Services Optimized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <CardDescription>
              Dynamic pricing enabled
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="scenarios">Price Scenarios</TabsTrigger>
          <TabsTrigger value="insights">Revenue Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Pricing Rules</CardTitle>
              <CardDescription>
                Time-based pricing adjustments for demand optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup className="flex flex-col gap-3">
                {rules.map((rule) => {
                  const isSurge = rule.adjustment_type === 'surge'
                  const badgeLabel = isSurge
                    ? `+${rule.adjustment_percentage}% Surge`
                    : `-${rule.adjustment_percentage}% Discount`

                  return (
                    <Item
                      key={`${rule.day_of_week}-${rule.hour_start}-${rule.hour_end}`}
                      variant="outline"
                      className="items-center justify-between gap-3"
                    >
                      <ItemContent className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{getDayName(rule.day_of_week)}</Badge>
                        </div>
                        <ItemDescription className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3" />
                          {formatTime(rule.hour_start)} - {formatTime(rule.hour_end)}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex items-center gap-2">
                        {isSurge ? (
                          <TrendingUp className="h-4 w-4 text-primary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-secondary" />
                        )}
                        <Badge variant={isSurge ? 'default' : 'secondary'}>{badgeLabel}</Badge>
                      </ItemActions>
                    </Item>
                  )
                })}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Scenarios</CardTitle>
                  <CardDescription>
                    See how pricing changes throughout the week
                  </CardDescription>
                </div>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Filter by day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ItemGroup className="flex flex-col gap-3">
                {filteredScenarios.map((scenario) => (
                  <Item
                    key={`${scenario.day}-${scenario.hour}`}
                    variant="outline"
                    className="items-center justify-between gap-3"
                  >
                    <ItemContent className="flex items-center gap-3">
                      <ItemTitle className="w-24 font-medium">
                        {getDayName(scenario.day)}
                      </ItemTitle>
                      <ItemDescription>{formatTime(scenario.hour)}</ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(scenario.base_price)}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(scenario.adjusted_price)}
                      </span>
                      {scenario.adjustment_type !== 'none' ? (
                        <Badge variant={scenario.adjustment_type === 'surge' ? 'default' : 'secondary'}>
                          {scenario.adjustment_type === 'surge' ? '+' : '-'}
                          {scenario.adjustment_percentage}%
                        </Badge>
                      ) : null}
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Optimization Insights</CardTitle>
              <CardDescription>
                Potential revenue impact from dynamic pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup className="flex flex-col gap-3">
                {insights.map((insight) => (
                  <Item key={insight.service_id} variant="outline" className="flex-col gap-3">
                    <ItemContent className="flex items-start justify-between gap-4">
                      <div>
                        <ItemTitle>{insight.service_name}</ItemTitle>
                        <ItemDescription>
                          Base price: {formatCurrency(insight.base_price)}
                        </ItemDescription>
                      </div>
                      <ItemActions className="flex-none">
                        <Badge>+{formatCurrency(insight.potential_revenue_increase)}/mo</Badge>
                      </ItemActions>
                    </ItemContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Off-Peak Price</p>
                          <p className="font-semibold">
                            {formatCurrency(insight.avg_off_peak_price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Peak Price</p>
                          <p className="font-semibold">
                            {formatCurrency(insight.avg_peak_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
