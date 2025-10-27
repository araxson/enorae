import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import type { CouponFormState } from '@/features/business/coupons/components/coupon-form.types'

interface CouponBasicSectionProps {
  formData: CouponFormState
  onChange: (
    update: CouponFormState | ((current: CouponFormState) => CouponFormState)
  ) => void
  onGenerateCode: () => void
}

export function CouponBasicSection({ formData, onChange, onGenerateCode }: CouponBasicSectionProps) {
  const setFormData = onChange

  return (
    <FieldSet className="space-y-4">
      <Field>
        <FieldLabel htmlFor="code">Coupon Code</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id="code"
              value={formData.code}
              onChange={(event) =>
                setFormData({ ...formData, code: event.target.value.toUpperCase() })
              }
              placeholder="e.g., SAVE20"
              required
            />
            <InputGroupButton type="button" variant="outline" onClick={onGenerateCode}>
              Generate
            </InputGroupButton>
          </InputGroup>
        </FieldContent>
        <FieldDescription>Codes are automatically uppercased for consistency.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            placeholder="Describe this promotion..."
            rows={3}
            required
          />
        </FieldContent>
      </Field>
    </FieldSet>
  )
}
