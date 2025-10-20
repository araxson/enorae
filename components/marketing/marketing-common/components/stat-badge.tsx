import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatBadgeProps {
  icon: LucideIcon
  value: string
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary-foreground',
  success: 'bg-chart-1/20 text-chart-1',
  warning: 'bg-chart-4/20 text-chart-4',
}

export function StatBadge({ icon: Icon, value, label, color = 'primary' }: StatBadgeProps) {
  return (
    <Card>
      <CardHeader className="items-center pb-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg text-lg shadow-inner">
          <span className={cn('flex h-full w-full items-center justify-center rounded-lg', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </span>
        </div>
        <CardTitle>{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 text-center">
        <CardDescription>
          Snapshot of a key marketing metric.
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 justify-center">
        <span className="text-xs text-muted-foreground">Updated hourly</span>
      </CardFooter>
    </Card>
  )
}
