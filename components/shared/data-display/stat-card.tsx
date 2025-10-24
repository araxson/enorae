import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  description,
  icon,
  className,
}: StatCardProps) {
  const isPositive = trend === 'up' || (change !== undefined && change > 0)
  const isNegative = trend === 'down' || (change !== undefined && change < 0)

  return (
    <Card
      className={cn('w-full', className)}
      role="article"
      aria-label={`${label}: ${value}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <CardTitle id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div aria-hidden="true" className="text-muted-foreground">{icon}</div>}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <span
          className="text-3xl font-bold"
          aria-describedby={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {value}
        </span>

        {change !== undefined && (
          <Badge
            variant={isNegative ? 'destructive' : 'secondary'}
            className="flex items-center gap-2"
            role="status"
            aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%`}
          >
            {isPositive && <TrendingUp className="h-3 w-3" aria-hidden="true" />}
            {isNegative && <TrendingDown className="h-3 w-3" aria-hidden="true" />}
            <span>
              {change > 0 && '+'}
              {change}%
            </span>
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
