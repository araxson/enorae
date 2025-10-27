'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="flex flex-col gap-6">

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={state.cost}
                onChange={(event) => onChange('cost', event.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Cost to provide this service</p>
            </div>

            <div className="space-y-2">
              <Label>Estimated Profit Margin</Label>
              <Input id="profit-margin" value={`${profitMargin}%`} readOnly />
              <p className="text-xs text-muted-foreground">Auto-calculated from price & cost</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
