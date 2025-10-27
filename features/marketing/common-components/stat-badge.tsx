import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
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
      <ItemHeader className="flex flex-col items-center gap-3">
        <ItemMedia variant="icon">
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </ItemMedia>
        <ItemTitle>{value}</ItemTitle>
      </ItemHeader>
      <ItemContent className="max-w-[16rem]">
        <ItemDescription>{label}</ItemDescription>
      </ItemContent>
    </Item>
  )
}
