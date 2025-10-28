import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type AnomalyScoreCardProps = {
  anomalyScore: number
}

export function AnomalyScoreCard({ anomalyScore }: AnomalyScoreCardProps) {
  const statusMessage = anomalyScore > 0.7 ? 'High anomaly detected' : 'Normal operations'

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Anomaly Score</ItemTitle>
              <ItemDescription>{statusMessage}</ItemDescription>
            </ItemContent>
            <ItemActions className="flex-none text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item>
            <ItemContent>
              <CardTitle>{anomalyScore.toFixed(2)}</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
