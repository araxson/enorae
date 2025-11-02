'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { BulkFormSectionsProps } from './types'

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
