'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import type { PricingFormState } from './use-pricing-form'

type CostProfitSectionProps = {
  state: PricingFormState
  profitMargin: string
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function CostProfitSection({ state, profitMargin, onChange }: CostProfitSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost & Profitability</CardTitle>
        <CardDescription>Track service costs and resulting margins.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="cost">Cost</FieldLabel>
            <FieldContent>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={state.cost}
                onChange={(event) => onChange('cost', event.target.value)}
                placeholder="0.00"
              />
            </FieldContent>
            <FieldDescription>Cost to provide this service.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Estimated Profit Margin</FieldLabel>
            <FieldContent>
              <Input id="profit-margin" value={`${profitMargin}%`} readOnly />
            </FieldContent>
            <FieldDescription>Auto-calculated from price and cost.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
