import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

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
  const shouldShowTime = ruleType === 'time_based' || ruleType === 'day_based'
  const selectedDays = formData.days_of_week.map((day: number) => day.toString())

  return (
    <FieldSet className="flex flex-col gap-6">
      <FieldLegend>Schedule</FieldLegend>

      {shouldShowTime ? (
        <FieldGroup className="grid gap-6 md:grid-cols-2">
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
          <ToggleGroup
            type="multiple"
            value={selectedDays}
            onValueChange={(values) =>
              setFormData((current: PricingRuleFormState) => ({
                ...current,
                days_of_week: values.map((value) => Number(value)),
              }))
            }
            aria-label="Select days of the week for this rule"
            className="flex flex-wrap gap-2 pt-2"
          >
            {dayOptions.map((day) => (
              <ToggleGroupItem key={day.value} value={day.value.toString()} className="w-10">
                {day.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FieldContent>
        <FieldDescription>Combine time and day settings to refine when rules apply.</FieldDescription>
      </Field>
    </FieldSet>
  )
}
