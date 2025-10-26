import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { dayOptions } from './constants'

import type { Dispatch, SetStateAction } from 'react'
import type { RuleType } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type ScheduleFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  ruleType: RuleType
}

export function ScheduleFields({ formData, setFormData, ruleType }: ScheduleFieldsProps) {
  const shouldShowTime = ruleType === 'time_based' || ruleType === 'day_based'
  const selectedDays = formData.days_of_week.map((day) => day.toString())

  return (
    <div className="flex flex-col gap-6">
      <Label>Schedule</Label>

      {shouldShowTime ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(event) =>
                setFormData((current) => ({ ...current, start_time: event.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(event) =>
                setFormData((current) => ({ ...current, end_time: event.target.value }))
              }
            />
          </div>
        </div>
      ) : null}

      <div>
        <Label>Days of Week</Label>
        <ToggleGroup
          type="multiple"
          value={selectedDays}
          onValueChange={(values) =>
            setFormData((current) => ({
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
      </div>
    </div>
  )
}
