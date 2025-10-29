import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection, StatBadge } from '@/features/marketing/common-components'

import { metrics } from './metrics.data'

export function Metrics() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Item variant="outline" className="flex flex-col gap-6">
        <ItemHeader className="flex flex-col items-center text-center">
          <ItemTitle>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Trusted by beauty professionals
            </h2>
          </ItemTitle>
          <p className="text-muted-foreground text-base md:text-lg">
            Key platform metrics updated weekly
          </p>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-4">
            <Item variant="muted">
              <ItemContent>
                <ItemDescription>Platform insights refresh every Monday morning.</ItemDescription>
              </ItemContent>
            </Item>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((stat) => (
                <StatBadge key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </ItemContent>
      </Item>
    </MarketingSection>
  )
}
