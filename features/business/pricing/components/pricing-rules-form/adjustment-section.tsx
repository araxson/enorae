import { Fragment } from 'react'

import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

import type { Dispatch, SetStateAction } from 'react'
import type { PricingRuleFormState } from '../../api/types'

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
    <FieldSet className="flex flex-col gap-4">
      <FieldLegend>Adjustment</FieldLegend>
      <FieldDescription>
        Applying pricing adjustments for {selectedServiceName.toLowerCase()}.
      </FieldDescription>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {adjustmentOptions.map((option) => (
          <Fragment key={option}>
            {option === 'multiplier' ? (
              <Field>
                <FieldLabel htmlFor="multiplier">Price Multiplier</FieldLabel>
                <FieldContent>
                  <Input
                    id="multiplier"
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={formData.multiplier}
                    onChange={(event) =>
                      setFormData((current: PricingRuleFormState) => ({
                        ...current,
                        multiplier: parseFloat(event.target.value),
                      }))
                    }
                  />
                </FieldContent>
                <FieldDescription>
                  1.0 = no change, 1.3 = 30% increase, 0.8 = 20% decrease.
                </FieldDescription>
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="fixed_adjustment">Fixed Adjustment ($)</FieldLabel>
                <FieldContent>
                  <Input
                    id="fixed_adjustment"
                    type="number"
                    step="0.5"
                    value={formData.fixed_adjustment}
                    onChange={(event) =>
                      setFormData((current: PricingRuleFormState) => ({
                        ...current,
                        fixed_adjustment: Number(event.target.value),
                      }))
                    }
                  />
                </FieldContent>
                <FieldDescription>
                  Add or subtract a fixed amount per booking.
                </FieldDescription>
              </Field>
            )}
          </Fragment>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}
