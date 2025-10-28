import { CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from './utils'

interface SummarySectionProps {
  servicesCount: number
  totalDuration: number
  totalPrice: number
}

export function SummarySection({ servicesCount, totalDuration, totalPrice }: SummarySectionProps) {
  return (
    <>
      <Separator className="mt-6" />
      <div className="flex items-center justify-between pt-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Services: {servicesCount}</p>
          <p className="text-sm text-muted-foreground">Total Duration: {totalDuration} minutes</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Price</p>
          <CardTitle>{formatCurrency(totalPrice)}</CardTitle>
        </div>
      </div>
    </>
  )
}
