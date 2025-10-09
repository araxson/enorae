import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Small } from '@/components/ui/typography'

interface RevenueCardProps {
  title: string
  amount: number
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  period?: string
  className?: string
}

export function RevenueCard({
  title,
  amount,
  trend,
  period = 'vs last period',
  className,
}: RevenueCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.direction === 'up' && (
              <TrendingUp className="h-3 w-3 text-green-600" />
            )}
            {trend.direction === 'down' && (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <Small
              className={
                trend.direction === 'up'
                  ? 'text-green-600'
                  : trend.direction === 'down'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              }
            >
              {formatPercentage(trend.value)} {period}
            </Small>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
