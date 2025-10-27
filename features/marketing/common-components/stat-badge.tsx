import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { LucideIcon } from 'lucide-react'

interface StatBadgeProps {
  icon: LucideIcon
  value: string
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

export function StatBadge({ icon: Icon, value, label }: StatBadgeProps) {
  return (
    <Item className="flex-col items-center text-center" variant="outline">
      <ItemMedia variant="icon">
        <Icon className="size-5 text-primary" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{value}</ItemTitle>
        <ItemDescription>{label}</ItemDescription>
      </ItemContent>
    </Item>
  )
}
