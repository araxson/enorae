import { Fragment } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

import { dayOptions, segmentOptions, ruleLabels } from './constants'

import type { Dispatch, SetStateAction } from 'react'
import type { RuleType } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type RuleBasicsFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  services: Array<{ id: string; name: string; price?: number }>
}

export function RuleBasicsFields({ formData, setFormData, services }: RuleBasicsFieldsProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="rule_name">Rule Name</FieldLabel>
        <FieldContent>
          <Input
            id="rule_name"
            value={formData.rule_name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, rule_name: event.target.value }))
            }
            placeholder="e.g., Peak Hours Premium"
            required
          />
        </FieldContent>
        <FieldDescription>Give the pricing rule a descriptive title.</FieldDescription>
      </Field>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="rule_type">Rule Type</FieldLabel>
          <FieldContent>
            <Select
              value={formData.rule_type}
              onValueChange={(value: RuleType) =>
                setFormData((current) => ({ ...current, rule_type: value }))
              }
            >
              <SelectTrigger id="rule_type">
                <SelectValue placeholder="Select rule type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ruleLabels) as RuleType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ruleLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="service_id">Target Service</FieldLabel>
          <FieldContent>
            <Select
              value={formData.service_id}
              onValueChange={(value) =>
                setFormData((current) => ({ ...current, service_id: value }))
              }
            >
              <SelectTrigger id="service_id">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                    {typeof service.price === 'number' ? ` • $${service.price.toFixed(2)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
          <FieldDescription>Apply the rule broadly or to a specific service.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

type AdjustmentFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  selectedServiceName: string
}

export function AdjustmentFields({
  formData,
  setFormData,
  selectedServiceName,
}: AdjustmentFieldsProps) {
  const adjustmentOptions =
    formData.rule_type === 'demand' || formData.rule_type === 'customer_segment'
      ? ['multiplier', 'fixed']
      : ['fixed', 'multiplier']

  return (
    <FieldSet className="flex flex-col gap-4">
      <FieldLegend>Adjustment</FieldLegend>
      <FieldDescription>
        Applying pricing adjustments for {selectedServiceName.toLowerCase()}.
      </FieldDescription>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {adjustmentOptions.map((option) => (
          <Fragment key={option}>
            {option === 'multiplier' ? (
              <Field>
                <FieldLabel htmlFor="multiplier">Price Multiplier</FieldLabel>
                <FieldContent>
                  <Input
                    id="multiplier"
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={formData.multiplier}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        multiplier: parseFloat(event.target.value),
                      }))
                    }
                  />
                </FieldContent>
                <FieldDescription>
                  1.0 = no change, 1.3 = 30% increase, 0.8 = 20% decrease.
                </FieldDescription>
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="fixed_adjustment">Fixed Adjustment ($)</FieldLabel>
                <FieldContent>
                  <Input
                    id="fixed_adjustment"
                    type="number"
                    step="0.5"
                    value={formData.fixed_adjustment}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        fixed_adjustment: Number(event.target.value),
                      }))
                    }
                  />
                </FieldContent>
                <FieldDescription>
                  Add or subtract a fixed amount per booking.
                </FieldDescription>
              </Field>
            )}
          </Fragment>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}

type ScheduleFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  ruleType: RuleType
}

export function ScheduleFields({ formData, setFormData, ruleType }: ScheduleFieldsProps) {
  const toggleDay = (day: number) => {
    setFormData((current) => {
      const hasDay = current.days_of_week.includes(day)
      if (hasDay) {
        return { ...current, days_of_week: current.days_of_week.filter((d) => d !== day) }
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
                  setFormData((current) => ({ ...current, start_time: event.target.value }))
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
                  setFormData((current) => ({ ...current, end_time: event.target.value }))
                }
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      ) : null}

      <Field>
        <FieldLabel>Days of Week</FieldLabel>
        <FieldContent>
          <ButtonGroup className="flex flex-wrap gap-2 pt-2">
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

type ValidityFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  selectedServiceName: string
}

export function ValidityFields({
  formData,
  setFormData,
  selectedServiceName,
}: ValidityFieldsProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="valid_from">Valid From</FieldLabel>
          <FieldContent>
            <Input
              id="valid_from"
              type="date"
              value={formData.valid_from}
              onChange={(event) =>
                setFormData((current) => ({ ...current, valid_from: event.target.value }))
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="valid_until">Valid Until</FieldLabel>
          <FieldContent>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until}
              onChange={(event) =>
                setFormData((current) => ({ ...current, valid_until: event.target.value }))
              }
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="customer_segment">Customer Segment</FieldLabel>
        <FieldContent>
          <Select
            value={formData.customer_segment}
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, customer_segment: value }))
            }
          >
            <SelectTrigger id="customer_segment">
              <SelectValue placeholder="All customers" />
            </SelectTrigger>
            <SelectContent>
              {segmentOptions.map((segment) => (
                <SelectItem key={segment.value} value={segment.value}>
                  {segment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <FieldGroup className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="priority">Priority</FieldLabel>
          <FieldContent>
            <Input
              id="priority"
              type="number"
              min="1"
              max="100"
              value={formData.priority}
              onChange={(event) =>
                setFormData((current) => ({ ...current, priority: Number(event.target.value) }))
              }
            />
          </FieldContent>
          <FieldDescription>
            Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
          </FieldDescription>
        </Field>
        <Card>
          <CardHeader>
            <CardTitle id="active-rule-title">Active rule</CardTitle>
            <CardDescription>Deactivate to save rule for later use.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Switch
              id="is_active"
              aria-labelledby="active-rule-title"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((current) => ({ ...current, is_active: checked }))
              }
            />
          </CardContent>
        </Card>
      </FieldGroup>
    </FieldSet>
  )
}
