'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { PricingFormState } from './use-pricing-form'

type TaxCommissionSectionProps = {
  state: PricingFormState
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function TaxCommissionSection({ state, onChange }: TaxCommissionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax & Commission</CardTitle>
        <CardDescription>Set taxation and staff commission details.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="taxRate">Tax Rate (%)</FieldLabel>
            <FieldContent>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={state.taxRate}
                onChange={(event) => onChange('taxRate', event.target.value)}
                placeholder="0.00"
              />
            </FieldContent>
            <FieldDescription>Sales tax percentage.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="commissionRate">Commission Rate (%)</FieldLabel>
            <FieldContent>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={state.commissionRate}
                onChange={(event) => onChange('commissionRate', event.target.value)}
                placeholder="0.00"
              />
            </FieldContent>
            <FieldDescription>Staff commission percentage.</FieldDescription>
          </Field>
        </FieldGroup>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="isTaxable">This service is taxable</FieldLabel>
          <FieldContent>
            <Checkbox
              id="isTaxable"
              checked={state.isTaxable}
              onCheckedChange={(checked) => onChange('isTaxable', Boolean(checked))}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="currencyCode">Currency Code</FieldLabel>
          <FieldContent>
            <Input
              id="currencyCode"
              name="currencyCode"
              value={state.currencyCode}
              onChange={(event) => onChange('currencyCode', event.target.value.toUpperCase())}
              placeholder="USD"
              maxLength={3}
            />
          </FieldContent>
          <FieldDescription>ISO currency code (e.g., USD, EUR).</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  )
}
