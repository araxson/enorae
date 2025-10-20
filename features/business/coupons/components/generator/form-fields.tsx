import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import type { BulkCouponFormState } from './types'

interface FormFieldsProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

export function FormFields({ formState, updateFormState }: FormFieldsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="prefix">Code Prefix</Label>
          <Input
            id="prefix"
            value={formState.prefix}
            onChange={(event) => updateFormState({ prefix: event.target.value.toUpperCase() })}
            maxLength={6}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Prefix will be combined with random characters for uniqueness.
          </p>
        </div>

        <div>
          <Label htmlFor="count">Quantity</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={100}
            value={formState.count}
            onChange={(event) => updateFormState({ count: Number(event.target.value) })}
            required
          />
        </div>

        <div>
          <Label htmlFor="bulk-discount-type-percentage">Discount Type</Label>
          <RadioGroup
            value={formState.discount_type}
            onValueChange={(value) => updateFormState({ discount_type: value as 'percentage' | 'fixed' })}
            className="flex flex-wrap gap-3 pt-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="bulk-discount-type-percentage" value="percentage" />
              <Label htmlFor="bulk-discount-type-percentage" className="text-sm font-normal">
                Percentage (%)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="bulk-discount-type-fixed" value="fixed" />
              <Label htmlFor="bulk-discount-type-fixed" className="text-sm font-normal">
                Fixed Amount ($)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="discount-value">
            Discount Value {formState.discount_type === 'percentage' ? '(%)' : '($)'}
          </Label>
          <Input
            id="discount-value"
            type="number"
            min={0}
            max={formState.discount_type === 'percentage' ? 100 : undefined}
            step={formState.discount_type === 'percentage' ? 1 : 0.5}
            value={formState.discount_value}
            onChange={(event) =>
              updateFormState({ discount_value: Number(event.target.value) })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Campaign Description</Label>
          <Input
            id="description"
            value={formState.description}
            onChange={(event) => updateFormState({ description: event.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="valid-from">Valid From</Label>
          <Input
            id="valid-from"
            type="datetime-local"
            value={formState.valid_from}
            onChange={(event) => updateFormState({ valid_from: event.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="valid-until">Valid Until</Label>
          <Input
            id="valid-until"
            type="datetime-local"
            value={formState.valid_until}
            onChange={(event) => updateFormState({ valid_until: event.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="min-purchase">Minimum Purchase ($)</Label>
          <Input
            id="min-purchase"
            type="number"
            min={0}
            step={0.5}
            value={formState.min_purchase_amount ?? ''}
            onChange={(event) =>
              updateFormState({
                min_purchase_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="max-discount">Maximum Discount ($)</Label>
          <Input
            id="max-discount"
            type="number"
            min={0}
            step={0.5}
            value={formState.max_discount_amount ?? ''}
            onChange={(event) =>
              updateFormState({
                max_discount_amount: event.target.value ? Number(event.target.value) : null,
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <div>
          <Label htmlFor="bulk-active" className="text-sm font-medium">
            Set campaign active
          </Label>
          <p className="text-xs text-muted-foreground">
            Generated coupons will be immediately usable when active.
          </p>
        </div>
        <Switch
          id="bulk-active"
          checked={formState.is_active}
          onCheckedChange={(checked) => updateFormState({ is_active: Boolean(checked) })}
        />
      </div>
    </>
  )
}
