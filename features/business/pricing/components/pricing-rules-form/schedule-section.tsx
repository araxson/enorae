import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

import { dayOptions } from './constants'

import type { Dispatch, SetStateAction } from 'react'
import type { RuleType } from './constants'
import type { PricingRuleFormState } from '../../api/types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type ScheduleFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  ruleType: RuleType
}

export function ScheduleFields({ formData, setFormData, ruleType }: ScheduleFieldsProps) {
  const toggleDay = (day: number) => {
    setFormData((current: PricingRuleFormState) => {
      const hasDay = current.days_of_week.includes(day)
      if (hasDay) {
        return { ...current, days_of_week: current.days_of_week.filter((d: number) => d !== day) }
      }
      return { ...current, days_of_week: [...current.days_of_week, day] }
    })
  }

  const shouldShowTime = ruleType === 'time_based' || ruleType === 'day_based'

  return (
    <FieldSet className="flex flex-col gap-4">
      <FieldLegend>Schedule</FieldLegend>

      {shouldShowTime ? (
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="start_time">Start Time</FieldLabel>
            <FieldContent>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(event) =>
                  setFormData((current: PricingRuleFormState) => ({ ...current, start_time: event.target.value }))
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="end_time">End Time</FieldLabel>
            <FieldContent>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(event) =>
                  setFormData((current: PricingRuleFormState) => ({ ...current, end_time: event.target.value }))
                }
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      ) : null}

      <Field>
        <FieldLabel>Days of Week</FieldLabel>
        <FieldContent>
          <ButtonGroup aria-label="Select days of week">
            {dayOptions.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={formData.days_of_week.includes(day.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </Button>
            ))}
          </ButtonGroup>
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
