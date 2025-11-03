import { memo } from 'react'
import { Clock } from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type PeakHourCardProps = {
  peakHour: number
}

export const PeakHourCard = memo(function PeakHourCard({ peakHour }: PeakHourCardProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Peak Hour</ItemTitle>
          <ItemDescription>Busiest time of day</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <p className="text-2xl font-semibold leading-none tracking-tight">{peakHour}:00</p>
      </ItemContent>
    </Item>
  )
})
