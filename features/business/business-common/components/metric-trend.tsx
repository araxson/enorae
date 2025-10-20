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
        isPositive && 'text-success',
        isNegative && 'text-destructive',
        isNeutral && 'text-muted-foreground',
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className="h-3 w-3" />}
          {isNegative && <TrendingDown className="h-3 w-3" />}
          {isNeutral && <Minus className="h-3 w-3" />}
        </>
      )}
      <span className="text-xs font-medium">{formatValue(value)}</span>
    </div>
  )
}
