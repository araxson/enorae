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
    <Item variant="outline">
      <ItemContent>
        <div className="flex flex-col items-center gap-3 text-center">
          <ItemMedia variant="icon">
            <Icon className="size-5" aria-hidden="true" />
          </ItemMedia>
          <div className="flex flex-col">
            <ItemTitle>{value}</ItemTitle>
            <ItemDescription>{label}</ItemDescription>
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
