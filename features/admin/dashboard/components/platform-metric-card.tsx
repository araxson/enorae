import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface PlatformMetricCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  progressValue: number
  helper?: ReactNode
}

export function PlatformMetricCard({
  title,
  value,
  description,
  icon: Icon,
  progressValue,
  helper,
}: PlatformMetricCardProps) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemMedia variant="icon">
          <Icon className="size-5" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        {helper ? <ItemActions>{helper}</ItemActions> : null}
      </ItemHeader>
      <ItemContent>
        <ItemTitle>{value}</ItemTitle>
        <Progress value={progressValue} aria-label={`${title} progress`} />
      </ItemContent>
    </Item>
  )
}
