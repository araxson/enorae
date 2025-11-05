import { ItemDescription } from '@/components/ui/item'
import { MarketingPanel, MarketingSection, StatBadge } from '@/features/marketing/components/common'

import { metrics } from './metrics.data'

export function Metrics() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <MarketingPanel
        align="center"
        title="Trusted by beauty professionals"
        description="Key platform metrics updated weekly"
      >
        <ItemDescription>
          Platform insights refresh every Monday morning.
        </ItemDescription>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((stat) => (
            <StatBadge key={stat.label} {...stat} />
          ))}
        </div>
      </MarketingPanel>
    </MarketingSection>
  )
}
