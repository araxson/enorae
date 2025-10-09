import { Card, CardContent } from '@/components/ui/card'
import { H3, Muted } from '@/components/ui/typography'
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
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
}

export function StatBadge({ icon: Icon, value, label, color = 'primary' }: StatBadgeProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg text-lg shadow-inner">
            <span className={cn('flex h-full w-full items-center justify-center rounded-lg', colorClasses[color])}>
              <Icon className="h-6 w-6" />
            </span>
          </div>
          <div className="space-y-1">
            <H3 className="text-3xl font-bold">{value}</H3>
            <Muted>{label}</Muted>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
