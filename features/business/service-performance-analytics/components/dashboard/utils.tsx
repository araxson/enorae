import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'

export const getPerformanceIcon = (cancellationRate: number) => {
  if (cancellationRate < 10) return <TrendingUp className="size-4 text-primary" />
  if (cancellationRate > 20) return <TrendingDown className="size-4 text-destructive" />
  return <BarChart3 className="size-4 text-accent" />
}

// Re-export for backward compatibility
export { formatCurrency }
