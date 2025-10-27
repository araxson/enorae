'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
            <p className="text-xs text-muted-foreground">
              {rules.filter(r => r.adjustment_type === 'surge').length} surges,{' '}
              {rules.filter(r => r.adjustment_type === 'discount').length} discounts
            </p>
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
            <p className="text-xs text-muted-foreground">
              Estimated monthly increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Services Optimized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Dynamic pricing enabled
            </p>
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
              <div className="space-y-3">
                {rules.map((rule) => {
                  const isSurge = rule.adjustment_type === 'surge'
                  const badgeLabel = isSurge
                    ? `+${rule.adjustment_percentage}% Surge`
                    : `-${rule.adjustment_percentage}% Discount`

                  return (
                    <Card key={`${rule.day_of_week}-${rule.hour_start}-${rule.hour_end}`}>
                      <CardContent className="flex items-center justify-between gap-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{getDayName(rule.day_of_week)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(rule.hour_start)} - {formatTime(rule.hour_end)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSurge ? (
                            <TrendingUp className="h-4 w-4 text-primary" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-secondary" />
                          )}
                          <Badge variant={isSurge ? 'default' : 'secondary'}>{badgeLabel}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
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
              <div className="space-y-3">
                {filteredScenarios.map((scenario) => (
                  <Card key={`${scenario.day}-${scenario.hour}`}>
                    <CardContent className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-24 font-medium">{getDayName(scenario.day)}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(scenario.hour)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(scenario.base_price)}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(scenario.adjusted_price)}
                        </span>
                        {scenario.adjustment_type !== 'none' && (
                          <Badge variant={scenario.adjustment_type === 'surge' ? 'default' : 'secondary'}>
                            {scenario.adjustment_type === 'surge' ? '+' : '-'}
                            {scenario.adjustment_percentage}%
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
              <div className="space-y-3">
                {insights.map((insight) => (
                  <Card key={insight.service_id}>
                    <CardContent className="space-y-3 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{insight.service_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Base price: {formatCurrency(insight.base_price)}
                          </p>
                        </div>
                        <Badge>
                          +{formatCurrency(insight.potential_revenue_increase)}/mo
                        </Badge>
                      </div>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
