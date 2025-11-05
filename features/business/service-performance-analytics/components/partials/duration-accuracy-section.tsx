'use client'

import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

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
            <Item size="sm">
              <ItemContent>
                <ItemTitle>{entry.service_name}</ItemTitle>
              </ItemContent>
              {entry.variance != null && (
                <ItemActions>
                  <Badge variant={Math.abs(entry.variance) > 10 ? 'destructive' : 'outline'}>
                    {entry.variance > 0 ? '+' : ''}
                    {entry.variance} min
                  </Badge>
                </ItemActions>
              )}
            </Item>
          </AccordionTrigger>
          <AccordionContent>
            <FieldGroup className="gap-2">
              <Field orientation="horizontal">
                <FieldLabel>Scheduled</FieldLabel>
                <FieldContent>
                  <span className="text-sm text-muted-foreground">
                    {entry.expected_duration ? `${entry.expected_duration} min` : 'N/A'}
                  </span>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel>Actual</FieldLabel>
                <FieldContent>
                  <span className="text-sm text-muted-foreground">
                    {entry.actual_duration ? `${entry.actual_duration} min` : 'N/A'}
                  </span>
                </FieldContent>
              </Field>
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
