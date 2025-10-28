import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type PeakHourCardProps = {
  peakHour: number
}

export function PeakHourCard({ peakHour }: PeakHourCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Peak Hour</ItemTitle>
              <ItemDescription>Busiest time of day</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none text-muted-foreground">
              <Clock className="h-4 w-4" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>{peakHour}:00</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
