'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Grid, Stack } from '@/components/layout'
import { Muted } from '@/components/ui/typography'

import type { PricingFormState } from './use-pricing-form'

type TaxCommissionSectionProps = {
  state: PricingFormState
  onChange: <Key extends keyof PricingFormState>(field: Key, value: PricingFormState[Key]) => void
}

export function TaxCommissionSection({ state, onChange }: TaxCommissionSectionProps) {
  return (
    <Card>
      <CardContent>
        <Stack gap="lg">
          <Label className="font-semibold">Tax & Commission</Label>

          <Grid cols={{ base: 1, md: 2 }} gap="md">
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
              <Muted className="text-xs">Sales tax percentage</Muted>
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
              <Muted className="text-xs">Staff commission percentage</Muted>
            </div>
          </Grid>

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
            <Muted className="text-xs">ISO currency code (e.g., USD, EUR)</Muted>
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}
