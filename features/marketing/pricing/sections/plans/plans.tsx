import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel, MarketingSection } from '@/features/marketing/components/common'
import { Check } from 'lucide-react'
import { plansData } from './plans.data'

export function Plans() {
  return (
    <MarketingSection
      className="bg-background"
      spacing="normal"
      containerClassName="max-w-6xl"
      groupClassName="gap-10"
    >
      <MarketingPanel
        align="center"
        variant="muted"
        title={plansData.title}
        description="Compare tiers to find your salon's best fit."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plansData.plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col gap-4 rounded-lg bg-background p-1 ${plan.highlighted ? 'ring-2 ring-primary/20' : 'ring-1 ring-border/40'}`}
          >
            {plan.highlighted ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most popular</Badge>
              </div>
            ) : null}
            <MarketingPanel
              align="start"
              variant="outline"
              title={plan.name}
              description={plan.description}
              actions={
                <Button variant={plan.highlighted ? 'default' : 'outline'} size="lg">
                  {plan.cta}
                </Button>
              }
            >
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>{plan.price}</ItemTitle>
                  <ItemDescription>{plan.period}</ItemDescription>
                </ItemContent>
              </Item>
              <ItemSeparator />
              <ItemGroup className="gap-2">
                {plan.features.map((feature) => (
                  <Item key={feature} variant="muted">
                    <ItemMedia variant="icon">
                      <Check className="size-4" aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemDescription>{feature}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </MarketingPanel>
          </div>
        ))}
      </div>
    </MarketingSection>
  )
}
