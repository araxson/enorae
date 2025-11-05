
import { Calendar } from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type BusiestDayCardProps = {
  busiestDay: number
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function BusiestDayCard({ busiestDay }: BusiestDayCardProps) {
  const busiestDayName = DAY_NAMES[busiestDay] || 'Unknown'

  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Busiest Day</ItemTitle>
          <ItemDescription>Highest demand day</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <p className="text-2xl font-semibold leading-none tracking-tight">{busiestDayName}</p>
      </ItemContent>
    </Item>
  )
}