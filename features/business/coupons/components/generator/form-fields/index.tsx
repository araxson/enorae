'use client'

import { FieldSet } from '@/components/ui/field'
import { BasicInfoFields } from './basic-info-fields'
import { DiscountFields } from './discount-fields'
import { ValidityFields } from './validity-fields'
import { ConstraintFields } from './constraint-fields'
import { ActivationField } from './activation-field'
import type { BulkCouponFormState } from '../types'

interface FormFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Bulk coupon generator form fields
 *
 * Organized into logical sections:
 * - Basic info (prefix, count, discount type)
 * - Discount configuration (value, description)
 * - Validity period (from/until dates)
 * - Constraints (min purchase, max discount)
 * - Activation status
 */
export function FormFields({ formState, updateFormState }: FormFieldsProps) {
  return (
    <FieldSet className="flex flex-col gap-6">
      <BasicInfoFields formState={formState} updateFormState={updateFormState} />
      <DiscountFields formState={formState} updateFormState={updateFormState} />
      <ValidityFields formState={formState} updateFormState={updateFormState} />
      <ConstraintFields formState={formState} updateFormState={updateFormState} />
      <ActivationField formState={formState} updateFormState={updateFormState} />
    </FieldSet>
  )
}
