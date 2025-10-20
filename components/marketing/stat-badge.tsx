import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatBadgeProps {
  icon: LucideIcon
  value: string
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

const colorClasses: Record<Required<StatBadgeProps>['color'], string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

export function StatBadge({ icon: Icon, value, label, color = 'primary' }: StatBadgeProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg text-lg shadow-inner">
          <span className={cn('flex h-full w-full items-center justify-center rounded-lg', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </span>
        </div>
        <CardTitle>{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
    </Card>
  )
}
