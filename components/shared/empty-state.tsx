import { type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <Stack gap="md" className="items-center">
        <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <div>
          <H3>{title}</H3>
          <Muted>{description}</Muted>
        </div>
        {action && <div className="mt-2">{action}</div>}
      </Stack>
    </Card>
  )
}
