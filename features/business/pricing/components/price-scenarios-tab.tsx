'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { PricingScenario } from '@/features/business/pricing/types'
import { formatCurrency, formatTime, getDayName } from './pricing-utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader className="items-start justify-between gap-4">
        <div>
          <ItemTitle>Price Scenarios</ItemTitle>
          <ItemDescription>See how pricing changes throughout the week</ItemDescription>
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
      </ItemHeader>
      <ItemContent>
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
              <Item
                key={`${scenario.day}-${scenario.hour}-${index}`}
                variant="outline"
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <ItemContent className="flex items-center gap-3">
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
                </ItemContent>
              </Item>
            ))}
          </div>
        )}
      </ItemContent>
    </Item>
  )
}
