'use client'

import { Switch } from '@/components/ui/switch'
import { FieldLabel } from '@/components/ui/field'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import type { BulkFormSectionsProps } from '../../api/types'

export function ActiveToggleSection({ formState, onChange }: BulkFormSectionsProps) {
  return (
    <ItemGroup className="px-3 py-2">
      <Item className="items-start">
        <ItemContent>
          <ItemTitle>
            <FieldLabel htmlFor="bulk-active">Set campaign active</FieldLabel>
          </ItemTitle>
          <ItemDescription>
            Generated coupons will be immediately usable when active.
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-none">
          <Switch
            id="bulk-active"
            checked={formState.is_active}
            onCheckedChange={(checked) =>
              onChange({ is_active: Boolean(checked) })
            }
          />
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
