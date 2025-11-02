'use client'

import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type DurationAccuracy = {
  service_id: string
  service_name: string
  expected_duration: number | null
  actual_duration: number | null
  variance: number | null
}

export function DurationAccuracySection({ durationAccuracy }: { durationAccuracy: DurationAccuracy[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {durationAccuracy.map((entry) => (
        <AccordionItem key={entry.service_id} value={entry.service_id}>
          <AccordionTrigger>
            <div className="flex w-full items-center justify-between">
              <span>{entry.service_name}</span>
              {entry.variance != null && (
                <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'} className="ml-2">
                  {entry.variance > 0 ? '+' : ''}
                  {entry.variance} min
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Scheduled</span>
              <span>{entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Actual</span>
              <span>{entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
