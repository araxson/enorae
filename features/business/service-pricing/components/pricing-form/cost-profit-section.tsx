'use client'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { PricingFormState } from './use-pricing-form'

type CostProfitSectionProps = {
  state: PricingFormState
  profitMargin: string
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function CostProfitSection({ state, profitMargin, onChange }: CostProfitSectionProps) {
  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex flex-col gap-1">
          <ItemTitle>Cost &amp; Profitability</ItemTitle>
          <ItemDescription>Track service costs and resulting margins.</ItemDescription>
        </div>
      </ItemHeader>
      <ItemContent>
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
                onChange={(event) => onChange('cost', parseFloat(event.target.value) || 0)}
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
      </ItemContent>
    </Item>
  )
}
