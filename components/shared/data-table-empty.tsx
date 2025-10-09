import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { P, Muted } from '@/components/ui/typography'

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
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          {Icon && (
            <div className="rounded-full bg-muted p-4">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-2">
            <P className="font-semibold">{title}</P>
            <Muted>{description}</Muted>
          </div>
          {action && (
            <Button onClick={action.onClick} className="mt-2">
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
