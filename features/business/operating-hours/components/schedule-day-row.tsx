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
  disabled?: boolean
  errors?: Record<string, string[]>
}

export function ScheduleDayRow({ day, dayIndex, dayHours, onUpdate, disabled, errors }: ScheduleDayRowProps) {
  const openTimeError = errors?.[`open_time_${dayIndex}`]
  const closeTimeError = errors?.[`close_time_${dayIndex}`]

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
                disabled={dayHours.is_closed || disabled}
                aria-invalid={!!openTimeError}
                aria-describedby={openTimeError ? `open-${dayIndex}-error` : undefined}
              />
              {openTimeError && (
                <p id={`open-${dayIndex}-error`} className="text-sm text-destructive mt-1" role="alert">
                  {openTimeError[0]}
                </p>
              )}
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
                disabled={dayHours.is_closed || disabled}
                aria-invalid={!!closeTimeError}
                aria-describedby={closeTimeError ? `close-${dayIndex}-error` : undefined}
              />
              {closeTimeError && (
                <p id={`close-${dayIndex}-error`} className="text-sm text-destructive mt-1" role="alert">
                  {closeTimeError[0]}
                </p>
              )}
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
                  disabled={disabled}
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  )
}
