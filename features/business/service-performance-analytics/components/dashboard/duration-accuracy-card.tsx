'use client'

import { Badge } from '@/components/ui/badge'
import type { DurationAccuracy } from './types'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function DurationAccuracyCard({ durationAccuracy }: { durationAccuracy: DurationAccuracy[] }) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>Duration Accuracy</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="grid gap-3 md:grid-cols-2">
          {durationAccuracy.map((entry) => (
            <Item key={entry.service_id} variant="outline" className="flex-col gap-2">
              <ItemHeader className="pb-0">
                <ItemTitle>{entry.service_name}</ItemTitle>
              </ItemHeader>
              <ItemContent className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Scheduled</span>
                  <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Actual</span>
                  <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
                </div>
                {entry.variance != null ? (
                  <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'}>
                    {entry.variance > 0 ? '+' : ''}
                    {entry.variance} min variance
                  </Badge>
                ) : null}
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
