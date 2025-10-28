'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'

interface DayHours {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface ScheduleDayRowProps {
  day: string
  dayIndex: number
  dayHours: DayHours
  onUpdate: (
    dayIndex: number,
    field: 'open_time' | 'close_time' | 'is_closed',
    value: string | boolean
  ) => void
}

export function ScheduleDayRow({ day, dayIndex, dayHours, onUpdate }: ScheduleDayRowProps) {
  return (
    <AccordionItem value={String(dayIndex)}>
      <AccordionTrigger>
        <ItemGroup className="w-full pr-4">
          <Item>
            <ItemContent>
              <ItemTitle>{day}</ItemTitle>
            </ItemContent>
            <ItemActions className="flex-none">
              <ItemDescription>
                {dayHours.is_closed ? 'Closed' : `${dayHours.open_time} - ${dayHours.close_time}`}
              </ItemDescription>
            </ItemActions>
          </Item>
        </ItemGroup>
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="grid gap-4 grid-cols-1 items-end pt-4 md:grid-cols-4">
          <Field>
            <FieldLabel htmlFor={`open-${dayIndex}`}>Open Time</FieldLabel>
            <FieldContent>
              <Input
                id={`open-${dayIndex}`}
                type="time"
                value={dayHours.open_time}
                onChange={(e) => onUpdate(dayIndex, 'open_time', e.target.value)}
                disabled={dayHours.is_closed}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`close-${dayIndex}`}>Close Time</FieldLabel>
            <FieldContent>
              <Input
                id={`close-${dayIndex}`}
                type="time"
                value={dayHours.close_time}
                onChange={(e) => onUpdate(dayIndex, 'close_time', e.target.value)}
                disabled={dayHours.is_closed}
              />
            </FieldContent>
          </Field>

          <ItemGroup>
            <Item className="items-center">
              <ItemContent>
                <ItemTitle>
                  <FieldLabel htmlFor={`closed-${dayIndex}`}>
                    <span className="text-sm font-medium">Closed</span>
                  </FieldLabel>
                </ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none">
                <Switch
                  id={`closed-${dayIndex}`}
                  checked={dayHours.is_closed}
                  onCheckedChange={(checked) => onUpdate(dayIndex, 'is_closed', checked)}
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  )
}
