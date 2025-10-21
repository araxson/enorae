'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DurationAccuracy } from './types'

export function DurationAccuracyCard({ durationAccuracy }: { durationAccuracy: DurationAccuracy[] }) {
  return (
    <Card>
      <CardHeader>
      <CardTitle>Duration Accuracy</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 md:grid-cols-2">
      {durationAccuracy.map((entry) => (
        <Card key={entry.service_id}>
          <CardContent className="space-y-2 p-4">
            <p className="text-base font-medium">{entry.service_name}</p>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Scheduled</span>
              <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Actual</span>
              <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
            </div>
            {entry.variance != null && (
              <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'} className="mt-2">
                {entry.variance > 0 ? '+' : ''}{entry.variance} min variance
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
)
}
