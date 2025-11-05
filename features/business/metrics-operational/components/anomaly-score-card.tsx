
import { AlertTriangle } from 'lucide-react'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type AnomalyScoreCardProps = {
  anomalyScore: number
}

export function AnomalyScoreCard({ anomalyScore }: AnomalyScoreCardProps) {
  const statusMessage = anomalyScore > 0.7 ? 'High anomaly detected' : 'Normal operations'

  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemContent>
          <ItemTitle>Anomaly Score</ItemTitle>
          <ItemDescription>{statusMessage}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <AlertTriangle className="size-4 text-destructive" aria-hidden="true" />
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <p className="text-2xl font-semibold leading-none tracking-tight">
          {anomalyScore.toFixed(2)}
        </p>
      </ItemContent>
    </Item>
  )
}