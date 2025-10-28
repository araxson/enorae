import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type DemandForecastCardProps = {
  predictedDemand: unknown
}

export function DemandForecastCard({ predictedDemand }: DemandForecastCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item className="flex-col items-start gap-1">
            <ItemContent>
              <ItemTitle>Demand Forecast</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>AI-powered demand prediction</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(predictedDemand, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
