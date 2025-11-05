'use client'

import type { Ref } from 'react'
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
  errors?: Record<string, string[]>
  ref?: Ref<HTMLInputElement>
}

export function ScheduleDayRow({ day, dayIndex, dayHours, errors, ref }: ScheduleDayRowProps) {
    const openTimeError = errors?.[`day_${dayIndex}_open_time`]?.[0]
    const closeTimeError = errors?.[`day_${dayIndex}_close_time`]?.[0]
    const hasErrors = Boolean(openTimeError || closeTimeError)

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
            {/* Open Time */}
            <Field>
              <FieldLabel htmlFor={`day_${dayIndex}_open_time`}>
                Open Time
                {!dayHours.is_closed && (
                  <span className="text-destructive" aria-label="required"> *</span>
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  ref={dayIndex === 0 && hasErrors ? ref : undefined}
                  id={`day_${dayIndex}_open_time`}
                  name={`day_${dayIndex}_open_time`}
                  type="time"
                  defaultValue={dayHours.open_time}
                  disabled={dayHours.is_closed}
                  required={!dayHours.is_closed}
                  aria-required={!dayHours.is_closed}
                  aria-invalid={!!openTimeError}
                  aria-describedby={openTimeError ? `day_${dayIndex}_open_time_error` : undefined}
                  className={openTimeError ? 'border-destructive' : ''}
                />
                {openTimeError && (
                  <p
                    id={`day_${dayIndex}_open_time_error`}
                    className="text-sm text-destructive mt-1"
                    role="alert"
                  >
                    {openTimeError}
                  </p>
                )}
              </FieldContent>
            </Field>

            {/* Close Time */}
            <Field>
              <FieldLabel htmlFor={`day_${dayIndex}_close_time`}>
                Close Time
                {!dayHours.is_closed && (
                  <span className="text-destructive" aria-label="required"> *</span>
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  id={`day_${dayIndex}_close_time`}
                  name={`day_${dayIndex}_close_time`}
                  type="time"
                  defaultValue={dayHours.close_time}
                  disabled={dayHours.is_closed}
                  required={!dayHours.is_closed}
                  aria-required={!dayHours.is_closed}
                  aria-invalid={!!closeTimeError}
                  aria-describedby={closeTimeError ? `day_${dayIndex}_close_time_error` : undefined}
                  className={closeTimeError ? 'border-destructive' : ''}
                />
                {closeTimeError && (
                  <p
                    id={`day_${dayIndex}_close_time_error`}
                    className="text-sm text-destructive mt-1"
                    role="alert"
                  >
                    {closeTimeError}
                  </p>
                )}
              </FieldContent>
            </Field>

            {/* Closed Toggle */}
            <ItemGroup>
              <Item className="items-center">
                <ItemContent>
                  <ItemTitle>
                    <FieldLabel htmlFor={`day_${dayIndex}_is_closed`}>
                      <span className="text-sm font-medium">Closed</span>
                    </FieldLabel>
                  </ItemTitle>
                </ItemContent>
                <ItemActions className="flex-none">
                  <input
                    type="hidden"
                    name={`day_${dayIndex}_is_closed`}
                    value={dayHours.is_closed ? 'true' : 'false'}
                  />
                  <Switch
                    id={`day_${dayIndex}_is_closed`}
                    defaultChecked={dayHours.is_closed}
                    aria-label={`Mark ${day} as closed`}
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </FieldGroup>
        </AccordionContent>
      </AccordionItem>
    )
}
