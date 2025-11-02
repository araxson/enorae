import { AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type AnomalyScoreCardProps = {
  anomalyScore: number
}

export function AnomalyScoreCard({ anomalyScore }: AnomalyScoreCardProps) {
  const statusMessage = anomalyScore > 0.7 ? 'High anomaly detected' : 'Normal operations'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Score</CardTitle>
        <CardDescription>{statusMessage}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-start justify-between">
        <p className="text-2xl font-semibold leading-none tracking-tight">
          {anomalyScore.toFixed(2)}
        </p>
        <AlertTriangle className="size-4 text-destructive" aria-hidden="true" />
      </CardContent>
    </Card>
  )
}
