'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PricingFormState } from './use-pricing-form'

type TaxCommissionSectionProps = {
  state: PricingFormState
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function TaxCommissionSection({ state, onChange }: TaxCommissionSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <Label className="font-semibold">Tax & Commission</Label>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
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
              <p className="text-sm text-muted-foreground text-xs">Sales tax percentage</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
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
              <p className="text-sm text-muted-foreground text-xs">Staff commission percentage</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isTaxable"
              checked={state.isTaxable}
              onCheckedChange={(checked) => onChange('isTaxable', Boolean(checked))}
            />
            <Label htmlFor="isTaxable" className="cursor-pointer">
              This service is taxable
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currencyCode">Currency Code</Label>
            <Input
              id="currencyCode"
              name="currencyCode"
              value={state.currencyCode}
              onChange={(event) => onChange('currencyCode', event.target.value.toUpperCase())}
              placeholder="USD"
              maxLength={3}
            />
            <p className="text-sm text-muted-foreground text-xs">ISO currency code (e.g., USD, EUR)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
