'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { BulkFormSectionsProps } from '../../api/types'

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
