import { Fragment } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PricingRuleFormState } from './types'

type FormStateSetter = Dispatch<SetStateAction<PricingRuleFormState>>

type AdjustmentFieldsProps = {
  formData: PricingRuleFormState
  setFormData: FormStateSetter
  selectedServiceName: string
}

export function AdjustmentFields({
  formData,
  setFormData,
  selectedServiceName,
}: AdjustmentFieldsProps) {
  const adjustmentOptions =
    formData.rule_type === 'demand' || formData.rule_type === 'customer_segment'
      ? ['multiplier', 'fixed']
      : ['fixed', 'multiplier']

  return (
    <div className="flex flex-col gap-6">
      <Label>Adjustment</Label>
      <div className="text-sm text-muted-foreground">
        Applying pricing adjustments for {selectedServiceName.toLowerCase()}.
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {adjustmentOptions.map((option) => (
          <Fragment key={option}>
            {option === 'multiplier' ? (
              <div>
                <Label htmlFor="multiplier">Price Multiplier</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={formData.multiplier}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      multiplier: parseFloat(event.target.value),
                    }))
                  }
                />
                <p className="text-xs mt-1 text-muted-foreground">
                  1.0 = no change, 1.3 = 30% increase, 0.8 = 20% decrease
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="fixed_adjustment">Fixed Adjustment ($)</Label>
                <Input
                  id="fixed_adjustment"
                  type="number"
                  step="0.5"
                  value={formData.fixed_adjustment}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      fixed_adjustment: Number(event.target.value),
                    }))
                  }
                />
                <p className="text-xs mt-1 text-muted-foreground">
                  Add or subtract a fixed amount per booking.
                </p>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
