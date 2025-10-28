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
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

import { segmentOptions } from './constants'

import type { Dispatch, SetStateAction } from 'react'
import type { PricingRuleFormState } from './types'

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
        <Item variant="muted" className="flex-col gap-3">
          <ItemHeader>
            <div className="flex flex-col gap-1">
              <ItemTitle id="active-rule-title">Active rule</ItemTitle>
              <ItemDescription>Deactivate to save rule for later use.</ItemDescription>
            </div>
          </ItemHeader>
          <ItemContent>
            <div className="flex justify-end">
              <Switch
                id="is_active"
                aria-labelledby="active-rule-title"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((current) => ({ ...current, is_active: checked }))
                }
              />
            </div>
          </ItemContent>
        </Item>
      </FieldGroup>
    </FieldSet>
  )
}
