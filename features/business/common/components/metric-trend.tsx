import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricTrendProps {
  value: number
  className?: string
  showIcon?: boolean
}

export function MetricTrend({ value, className, showIcon = true }: MetricTrendProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  const formatValue = (val: number) => {
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        isPositive && 'text-primary',
        isNegative && 'text-destructive',
        isNeutral && 'text-muted-foreground',
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className="size-3" aria-hidden="true" />}
          {isNegative && <TrendingDown className="size-3" aria-hidden="true" />}
          {isNeutral && <Minus className="size-3" aria-hidden="true" />}
        </>
      )}
      <span className="text-xs font-medium">{formatValue(value)}</span>
    </div>
  )
}
