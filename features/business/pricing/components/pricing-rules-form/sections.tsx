import { Fragment } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { dayOptions, segmentOptions, ruleLabels, type RuleType } from './constants'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type RuleBasicsFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  services: Array<{ id: string; name: string; price?: number }>
}

export function RuleBasicsFields({ formData, setFormData, services }: RuleBasicsFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="rule_name">Rule Name</Label>
        <Input
          id="rule_name"
          value={formData.rule_name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, rule_name: event.target.value }))
          }
          placeholder="e.g., Peak Hours Premium"
          required
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <Label htmlFor="rule_type">Rule Type</Label>
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
        </div>

        <div>
          <Label htmlFor="service_id">Target Service</Label>
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
        </div>
      </div>
    </div>
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
    <div className="flex flex-col gap-4">
      <Label>Adjustment</Label>
      <div className="text-sm text-muted-foreground">
        Applying pricing adjustments for {selectedServiceName.toLowerCase()}.
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {adjustmentOptions.map((option) => (
          <Fragment key={option}>
            {option === 'multiplier' ? (
              <div>
                <Label htmlFor="multiplier">Price Multiplier</Label>
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
                <p className="mt-1 text-xs text-muted-foreground">
                  1.0 = no change, 1.3 = 30% increase, 0.8 = 20% decrease
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="fixed_adjustment">Fixed Adjustment ($)</Label>
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Add or subtract a fixed amount per booking.
                </p>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
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
    <div className="flex flex-col gap-4">
      <Label>Schedule</Label>

      {shouldShowTime ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
        <div className="flex flex-wrap gap-2 pt-2">
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
        </div>
      </div>
    </div>
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
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            type="date"
            value={formData.valid_from}
            onChange={(event) =>
              setFormData((current) => ({ ...current, valid_from: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="valid_until">Valid Until</Label>
          <Input
            id="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={(event) =>
              setFormData((current) => ({ ...current, valid_until: event.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customer_segment">Customer Segment</Label>
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
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 items-end">
        <div>
          <Label htmlFor="priority">Priority</Label>
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
          <p className="mt-1 text-xs text-muted-foreground">
            Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
          </p>
        </div>
        <div className="flex items-center justify-between rounded-md border px-4 py-3">
          <div>
            <Label htmlFor="is_active" className="text-base">
              Active Rule
            </Label>
            <p className="text-sm text-muted-foreground">Deactivate to save rule for later use.</p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData((current) => ({ ...current, is_active: checked }))
            }
          />
        </div>
      </div>
    </div>
  )
}
