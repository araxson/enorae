'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type BulkFormState = {
  prefix: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  min_purchase_amount: number | null
  max_discount_amount: number | null
}

type BulkFormSectionsProps = {
  formState: BulkFormState
  onChange: (updates: Partial<BulkFormState>) => void
}

export function BasicInfoSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Field>
        <FieldLabel htmlFor="prefix">Code Prefix</FieldLabel>
        <FieldContent>
          <Input
            id="prefix"
            value={formState.prefix}
            onChange={(event) =>
              onChange({ prefix: event.target.value.toUpperCase() })
            }
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
            onChange={(event) =>
              onChange({ count: Number(event.target.value) })
            }
            required
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="discount-type">Discount Type</FieldLabel>
        <FieldContent>
          <Select
            value={formState.discount_type}
            onValueChange={(value: 'percentage' | 'fixed') =>
              onChange({ discount_type: value })
            }
          >
            <SelectTrigger id="discount-type">
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

export function DiscountSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
              onChange({ discount_value: Number(event.target.value) })
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
            onChange={(event) =>
              onChange({ description: event.target.value })
            }
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

export function ValiditySection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="valid-from">Valid From</FieldLabel>
        <FieldContent>
          <Input
            id="valid-from"
            type="datetime-local"
            value={formState.valid_from}
            onChange={(event) =>
              onChange({ valid_from: event.target.value })
            }
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
            onChange={(event) =>
              onChange({ valid_until: event.target.value })
            }
            required
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

export function LimitsSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <FieldGroup className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
              onChange({
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
              onChange({
                max_discount_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

export function ActiveToggleSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <ItemGroup className="px-3 py-2">
      <Item className="items-start">
        <ItemContent>
          <ItemTitle>
            <FieldLabel htmlFor="bulk-active">Set campaign active</FieldLabel>
          </ItemTitle>
          <ItemDescription>
            Generated coupons will be immediately usable when active.
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-none">
          <Switch
            id="bulk-active"
            checked={formState.is_active}
            onCheckedChange={(checked) =>
              onChange({ is_active: Boolean(checked) })
            }
          />
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
