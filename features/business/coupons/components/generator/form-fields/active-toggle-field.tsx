'use client'

import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import type { FieldProps } from './types'

export function ActiveToggleField({ errors }: FieldProps) {
  return (
    <FieldGroup>
      <Field>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <FieldLabel htmlFor="is_active">
              Activate Immediately
            </FieldLabel>
            <FieldDescription>
              Enable coupons immediately after generation
            </FieldDescription>
          </div>
          <div>
            <input type="hidden" name="is_active" value="true" />
            <Switch
              id="is_active"
              defaultChecked={true}
              aria-label="Activate coupons immediately"
            />
          </div>
        </div>
      </Field>
    </FieldGroup>
  )
}
