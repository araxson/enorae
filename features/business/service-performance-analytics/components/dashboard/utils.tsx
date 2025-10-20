import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export const getPerformanceIcon = (cancellationRate: number) => {
  if (cancellationRate < 10) return <TrendingUp className="h-4 w-4 text-success" />
  if (cancellationRate > 20) return <TrendingDown className="h-4 w-4 text-destructive" />
  return <BarChart3 className="h-4 w-4 text-warning" />
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
