'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { PricingScenario } from '@/features/business/pricing/types'
import { formatCurrency, formatTime, getDayName } from './pricing-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface PriceScenariosTabProps {
  scenarios: PricingScenario[]
  selectedDay: string
  onDayChange: (day: string) => void
}

export function PriceScenariosTab({
  scenarios,
  selectedDay,
  onDayChange,
}: PriceScenariosTabProps) {
  const filteredScenarios = selectedDay === 'all'
    ? scenarios
    : scenarios.filter(s => s.day === selectedDay)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Price Scenarios</CardTitle>
            <CardDescription>
              See how pricing changes throughout the week
            </CardDescription>
          </div>
          <Select value={selectedDay} onValueChange={onDayChange}>
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
        {filteredScenarios.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No price scenarios available</EmptyTitle>
              <EmptyDescription>Select another day to view adjustments.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {filteredScenarios.map((scenario, index) => (
              <Card key={`${scenario.day}-${scenario.hour}-${index}`}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
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
                      <Badge
                        variant={scenario.adjustment_type === 'surge' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {scenario.adjustment_type === 'surge' ? '+' : '-'}
                        {scenario.adjustment_percentage}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
