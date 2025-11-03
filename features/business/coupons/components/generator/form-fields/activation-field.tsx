'use client'

import { Switch } from '@/components/ui/switch'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { FieldLabel } from '@/components/ui/field'
import type { BulkCouponFormState } from '../../../api/types'

interface ActivationFieldProps {
  formState: BulkCouponFormState
  updateFormState: (updates: Partial<BulkCouponFormState>) => void
}

/**
 * Activation toggle field for campaign status
 */
export function ActivationField({ formState, updateFormState }: ActivationFieldProps) {
  return (
    <ItemGroup className="px-3 py-2">
      <Item className="items-start">
        <ItemContent>
          <ItemTitle>
            <FieldLabel htmlFor="bulk-active" className="text-sm font-medium">
              Set campaign active
            </FieldLabel>
          </ItemTitle>
          <ItemDescription>
            Generated coupons will be immediately usable when active.
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-none">
          <Switch
            id="bulk-active"
            checked={formState.is_active}
            onCheckedChange={(checked) => updateFormState({ is_active: Boolean(checked) })}
          />
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
