import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type ForecastAccuracyCardProps = {
  forecastAccuracy: number
}

export function ForecastAccuracyCard({ forecastAccuracy }: ForecastAccuracyCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Forecast Accuracy</ItemTitle>
              <ItemDescription>Prediction confidence</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>{(forecastAccuracy * 100).toFixed(1)}%</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
