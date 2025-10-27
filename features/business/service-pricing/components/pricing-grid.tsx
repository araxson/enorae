import { PricingCard } from './pricing-card'
import type { ServicePricingWithService } from '@/features/business/service-pricing/api/queries'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

interface PricingGridProps {
  pricing: ServicePricingWithService[]
  onEdit?: (pricing: ServicePricingWithService) => void
}

export function PricingGrid({ pricing, onEdit }: PricingGridProps) {
  if (pricing.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No pricing configured yet</EmptyTitle>
          <EmptyDescription>Add pricing to surface services in booking flows.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {pricing.map((p) => (
        <PricingCard key={p['id']} pricing={p} onEdit={onEdit} />
      ))}
    </div>
  )
}
