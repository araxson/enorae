import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    <Card>
      <CardHeader className="text-center">
        <div className="flex flex-col items-center gap-4">
          {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
