'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

interface PricingScenario {
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

interface PriceScenariosTabProps {
  scenarios: PricingScenario[]
  selectedDay: string
  onDayChange: (day: string) => void
  formatCurrency: (amount: number) => string
  formatTime: (hour: number) => string
  getDayName: (day: string) => string
}

export function PriceScenariosTab({
  scenarios,
  selectedDay,
  onDayChange,
  formatCurrency,
  formatTime,
  getDayName,
}: PriceScenariosTabProps) {
  const filteredScenarios = selectedDay === 'all'
    ? scenarios
    : scenarios.filter(s => s.day === selectedDay)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Scenarios</CardTitle>
        <CardDescription>See how pricing changes throughout the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
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
        <ItemGroup className="flex flex-col gap-3">
          {filteredScenarios.map((scenario) => (
            <Item
              key={`${scenario.day}-${scenario.hour}`}
              variant="outline"
              className="items-center justify-between gap-3"
            >
              <ItemContent className="flex items-center gap-3">
                <div className="w-24 font-medium">{getDayName(scenario.day)}</div>
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
  )
}
