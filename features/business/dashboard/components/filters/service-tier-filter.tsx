'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type ServiceTier = 'all' | 'premium' | 'standard'

type ServiceTierFilterProps = {
  value: ServiceTier
  onChange: (value: ServiceTier) => void
}

export function ServiceTierFilter({ value, onChange }: ServiceTierFilterProps) {
  return (
    <Field className="min-w-[240px]">
      <FieldLabel>Service mix</FieldLabel>
      <FieldContent>
        <RadioGroup value={value} onValueChange={(val) => onChange(val as ServiceTier)}>
          <Field orientation="horizontal" className="items-center gap-2">
            <RadioGroupItem value="all" id="tier-all" />
            <FieldLabel htmlFor="tier-all">All services</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-center gap-2">
            <RadioGroupItem value="premium" id="tier-premium" />
            <FieldLabel htmlFor="tier-premium">Premium services</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-center gap-2">
            <RadioGroupItem value="standard" id="tier-standard" />
            <FieldLabel htmlFor="tier-standard">Standard services</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldContent>
    </Field>
  )
}
