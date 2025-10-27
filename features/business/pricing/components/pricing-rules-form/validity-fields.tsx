import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { segmentOptions } from './constants'
import type { PricingRuleFormState } from './types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

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
    <FieldGroup className="flex flex-col gap-8">
      <FieldGroup className="grid gap-6 md:grid-cols-2">
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

      <FieldGroup className="grid items-end gap-6 md:grid-cols-2">
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
            <FieldDescription>
              Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
            </FieldDescription>
          </FieldContent>
        </Field>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <FieldLabel htmlFor="is_active">Active Rule</FieldLabel>
              <CardDescription>Deactivate to save rule for later use.</CardDescription>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((current) => ({ ...current, is_active: checked }))
              }
            />
          </CardContent>
        </Card>
      </FieldGroup>
    </FieldGroup>
  )
}
