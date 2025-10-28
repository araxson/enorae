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
}

export function NotificationToggleItem({
  id,
  labelId,
  title,
  description,
  checked,
  onCheckedChange,
}: NotificationToggleItemProps) {
  return (
    <Item>
      <ItemContent>
        <ItemTitle id={labelId}>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions className="flex-none">
        <Switch
          id={id}
          aria-labelledby={labelId}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </ItemActions>
    </Item>
  )
}
