import { H2, Muted } from '@/components/ui/typography'
import { getProductUsage } from './api/queries'
import { UsageList } from './components/usage-list'

export async function ProductUsage() {
  const usage = await getProductUsage()

  return (
    <div className="space-y-6">
      <div>
        <H2>Product Usage</H2>
        <Muted className="mt-1">
          Track product consumption and costs
        </Muted>
      </div>

      <UsageList usage={usage} />
    </div>
  )
}
