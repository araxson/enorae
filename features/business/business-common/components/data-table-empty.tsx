import { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
      <CardHeader className="items-center text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
        {Icon && (
          <div className="rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </CardContent>
      {action && (
        <CardFooter className="justify-center">
          <Button variant="default" onClick={action.onClick}>{action.label}</Button>
        </CardFooter>
      )}
    </Card>
  )
}
