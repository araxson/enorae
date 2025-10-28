import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
} from '@/components/ui/item'
import { MarketingSection, StatBadge } from '@/features/marketing/common-components'

import { metrics } from './metrics.data'

export function Metrics() {
  return (
    <MarketingSection spacing="compact" groupClassName="gap-0">
      <Card>
        <CardHeader className="items-center justify-center">
          <CardTitle>Trusted by beauty professionals</CardTitle>
          <CardDescription>
            Key platform metrics updated weekly
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
        </CardContent>
      </Card>
    </MarketingSection>
  )
}
