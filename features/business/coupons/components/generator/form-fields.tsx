'use client'

import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { BulkCouponFormState } from './types'

interface FormFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

export function FormFields({ formState, updateFormState }: FormFieldsProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <FieldGroup className="grid gap-4 md:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="prefix">Code Prefix</FieldLabel>
          <FieldContent>
            <Input
              id="prefix"
              value={formState.prefix}
              onChange={(event) => updateFormState({ prefix: event.target.value.toUpperCase() })}
              maxLength={6}
              required
            />
            <FieldDescription>
              Prefix will be combined with random characters for uniqueness.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="count">Quantity</FieldLabel>
          <FieldContent>
            <Input
              id="count"
              type="number"
              min={1}
              max={100}
              value={formState.count}
              onChange={(event) => updateFormState({ count: Number(event.target.value) })}
              required
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="bulk-discount-type-percentage">Discount Type</FieldLabel>
          <FieldContent>
            <RadioGroup
              value={formState.discount_type}
              onValueChange={(value) => updateFormState({ discount_type: value as 'percentage' | 'fixed' })}
              className="flex flex-wrap gap-3 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="bulk-discount-type-percentage" value="percentage" />
                <FieldLabel htmlFor="bulk-discount-type-percentage" className="text-sm font-normal">
                  Percentage (%)
                </FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="bulk-discount-type-fixed" value="fixed" />
                <FieldLabel htmlFor="bulk-discount-type-fixed" className="text-sm font-normal">
                  Fixed Amount ($)
                </FieldLabel>
              </div>
            </RadioGroup>
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="discount-value">
            Discount Value {formState.discount_type === 'percentage' ? '(%)' : '($)'}
          </FieldLabel>
          <FieldContent>
            <Input
              id="discount-value"
              type="number"
              min={0}
              max={formState.discount_type === 'percentage' ? 100 : undefined}
              step={formState.discount_type === 'percentage' ? 1 : 0.5}
              value={formState.discount_value}
              onChange={(event) =>
                updateFormState({ discount_value: Number(event.target.value) })
              }
              required
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Campaign Description</FieldLabel>
          <FieldContent>
            <Input
              id="description"
              value={formState.description}
              onChange={(event) => updateFormState({ description: event.target.value })}
              required
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="valid-from">Valid From</FieldLabel>
          <FieldContent>
            <Input
              id="valid-from"
              type="datetime-local"
              value={formState.valid_from}
              onChange={(event) => updateFormState({ valid_from: event.target.value })}
              required
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="valid-until">Valid Until</FieldLabel>
          <FieldContent>
            <Input
              id="valid-until"
              type="datetime-local"
              value={formState.valid_until}
              onChange={(event) => updateFormState({ valid_until: event.target.value })}
              required
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="min-purchase">Minimum Purchase ($)</FieldLabel>
          <FieldContent>
            <Input
              id="min-purchase"
              type="number"
              min={0}
              step={0.5}
              value={formState.min_purchase_amount ?? ''}
              onChange={(event) =>
                updateFormState({
                  min_purchase_amount: event.target.value ? Number(event.target.value) : null,
                })
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="max-discount">Maximum Discount ($)</FieldLabel>
          <FieldContent>
            <Input
              id="max-discount"
              type="number"
              min={0}
              step={0.5}
              value={formState.max_discount_amount ?? ''}
              onChange={(event) =>
                updateFormState({
                  max_discount_amount: event.target.value ? Number(event.target.value) : null,
                })
              }
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <ItemGroup className="px-3 py-2">
        <Item className="items-start">
          <ItemContent>
            <ItemTitle>
              <FieldLabel htmlFor="bulk-active" className="text-sm font-medium">
                Set campaign active
              </FieldLabel>
            </ItemTitle>
            <ItemDescription>
              Generated coupons will be immediately usable when active.
            </ItemDescription>
          </ItemContent>
          <ItemActions className="flex-none">
            <Switch
              id="bulk-active"
              checked={formState.is_active}
              onCheckedChange={(checked) => updateFormState({ is_active: Boolean(checked) })}
            />
          </ItemActions>
        </Item>
      </ItemGroup>
    </FieldSet>
  )
}
