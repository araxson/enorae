'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { PricingScenario } from '../types'
import { formatCurrency, formatTime, getDayName } from './pricing-utils'

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
            <SelectTrigger className="w-[180px]">
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
          <div className="py-8 text-center text-muted-foreground">
            No price scenarios available for the selected day.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredScenarios.map((scenario, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">{getDayName(scenario.day)}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(scenario.hour)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm line-through text-muted-foreground">
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
