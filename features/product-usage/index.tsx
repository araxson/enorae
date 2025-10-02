import { UsageList } from './components/usage-list'
import type { ProductUsageWithDetails } from './dal/product-usage.queries'

type ProductUsageProps = {
  initialUsage: ProductUsageWithDetails[]
}

export function ProductUsage({ initialUsage }: ProductUsageProps) {
  return (
    <div className="space-y-6">
      <div>
        <H2>Product Usage</H2>
        <Muted className="mt-1">
          Track product consumption and costs
        </Muted>
      </div>

      <UsageList usage={initialUsage} />
    </div>
  )
}
