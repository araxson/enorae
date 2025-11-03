import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { segmentOptions } from './constants'
import type { PricingRuleFormState } from '../../api/types'
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
} from '@/components/ui/item'

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
    <FieldSet className="flex flex-col gap-8">
      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="valid_from">Valid From</FieldLabel>
          <FieldContent>
            <Input
              id="valid_from"
              type="date"
              value={formData.valid_from}
              onChange={(event) =>
                setFormData((current: PricingRuleFormState) => ({ ...current, valid_from: event.target.value }))
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
                setFormData((current: PricingRuleFormState) => ({ ...current, valid_until: event.target.value }))
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
              setFormData((current: PricingRuleFormState) => ({ ...current, customer_segment: value }))
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
                setFormData((current: PricingRuleFormState) => ({ ...current, priority: Number(event.target.value) }))
              }
            />
          </FieldContent>
          <FieldDescription>
            Lower numbers execute first when multiple rules apply (current target: {selectedServiceName}).
          </FieldDescription>
        </Field>
        <Item variant="muted" className="flex-col gap-3">
          <ItemContent>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="is_active">Active Rule</FieldLabel>
                <ItemDescription>Deactivate to save rule for later use.</ItemDescription>
              </FieldContent>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((current: PricingRuleFormState) => ({ ...current, is_active: checked }))
                }
              />
            </Field>
          </ItemContent>
        </Item>
      </FieldGroup>
    </FieldSet>
  )
}
