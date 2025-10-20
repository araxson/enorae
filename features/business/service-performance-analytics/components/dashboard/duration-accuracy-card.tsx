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
          <div key={entry.service_id} className="rounded-md border p-3">
            <p className="text-base font-medium">{entry.service_name}</p>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
              <p className="text-base mt-0 text-sm text-muted-foreground">Scheduled</p>
              <p className="text-base mt-0 text-sm text-muted-foreground">
                {entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p className="text-base mt-0 text-sm text-muted-foreground">Actual</p>
              <p className="text-base mt-0 text-sm text-muted-foreground">
                {entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}
              </p>
            </div>
            {entry.variance != null && (
              <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'} className="mt-2">
                {entry.variance > 0 ? '+' : ''}{entry.variance} min variance
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
