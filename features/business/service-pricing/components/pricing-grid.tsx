import { PricingCard } from './pricing-card'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'

interface PricingGridProps {
  pricing: ServicePricingWithService[]
  onEdit?: (pricing: ServicePricingWithService) => void
}

export function PricingGrid({ pricing, onEdit }: PricingGridProps) {
  if (pricing.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="leading-7 text-muted-foreground">No pricing configured yet</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {pricing.map((p) => (
        <PricingCard key={p.id} pricing={p} onEdit={onEdit} />
      ))}
    </div>
  )
}
