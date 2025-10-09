'use client'

import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Tax & Commission</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="isTaxable" checked={isTaxable} onCheckedChange={onTaxableChange} />
          <Label htmlFor="isTaxable" className="cursor-pointer">
            Taxable
          </Label>
        </div>

        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
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
        </div>

        <div>
          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
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
          <p className="text-xs text-muted-foreground mt-1">Staff commission</p>
        </div>
      </div>
    </section>
  )
}
