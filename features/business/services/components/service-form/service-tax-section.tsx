'use client'

import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'

interface ServiceTaxSectionProps {
  isTaxable: boolean
  taxRate: string
  commissionRate: string
  onTaxableChange: (value: boolean) => void
  onTaxRateChange: (value: string) => void
  onCommissionRateChange: (value: string) => void
}

export function ServiceTaxSection({
  isTaxable,
  taxRate,
  commissionRate,
  onTaxableChange,
  onTaxRateChange,
  onCommissionRateChange,
}: ServiceTaxSectionProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Tax &amp; commission</FieldLegend>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field orientation="horizontal" className="items-center gap-3">
          <Switch id="isTaxable" checked={isTaxable} onCheckedChange={onTaxableChange} />
          <FieldLabel htmlFor="isTaxable" className="cursor-pointer">
            Taxable
          </FieldLabel>
        </Field>

        <Field>
          <FieldLabel htmlFor="taxRate">Tax rate (%)</FieldLabel>
          <FieldContent>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={taxRate}
              onChange={(event) => onTaxRateChange(event.target.value)}
              placeholder="8.5"
              disabled={!isTaxable}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="commissionRate">Commission rate (%)</FieldLabel>
          <FieldContent>
            <Input
              id="commissionRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(event) => onCommissionRateChange(event.target.value)}
              placeholder="15"
            />
            <FieldDescription>Staff commission</FieldDescription>
          </FieldContent>
        </Field>
      </div>
    </FieldSet>
  )
}
