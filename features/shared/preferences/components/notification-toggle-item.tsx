'use client'

import { Switch } from '@/components/ui/switch'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'

interface NotificationToggleItemProps {
  id: string
  labelId: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function NotificationToggleItem({
  id,
  labelId,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: NotificationToggleItemProps) {
  return (
    <Item>
      <ItemContent>
        <ItemTitle id={labelId}>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <div className="flex-none">
        <ItemActions>
          <Switch
            id={id}
            aria-labelledby={labelId}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </ItemActions>
      </div>
    </Item>
  )
}
