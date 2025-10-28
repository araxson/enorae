import { LucideIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

interface DataTableEmptyProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function DataTableEmpty({
  icon: Icon,
  title,
  description,
  action,
}: DataTableEmptyProps) {
  return (
    <Empty>
      {Icon ? (
        <EmptyMedia variant="icon">
          <Icon className="size-6" />
        </EmptyMedia>
      ) : null}
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? (
        <EmptyContent>
          <Button onClick={action.onClick}>{action.label}</Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
