
import { TrendingUp } from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type ForecastAccuracyCardProps = {
  forecastAccuracy: number
}

export function ForecastAccuracyCard({ forecastAccuracy }: ForecastAccuracyCardProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Forecast Accuracy</ItemTitle>
          <ItemDescription>Prediction confidence</ItemDescription>
        </ItemContent>
        <ItemActions>
          <TrendingUp className="size-4 text-primary" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <p className="text-2xl font-semibold leading-none tracking-tight">
          {(forecastAccuracy * 100).toFixed(1)}%
        </p>
      </ItemContent>
    </Item>
  )
}