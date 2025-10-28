import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type BusiestDayCardProps = {
  busiestDay: number
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function BusiestDayCard({ busiestDay }: BusiestDayCardProps) {
  const busiestDayName = DAY_NAMES[busiestDay] || 'Unknown'

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Busiest Day</ItemTitle>
              <ItemDescription>Highest demand day</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>{busiestDayName}</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
