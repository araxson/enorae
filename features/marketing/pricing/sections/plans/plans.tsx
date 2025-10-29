import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { cn } from '@/lib/utils'
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
      <Item variant="muted">
        <ItemContent>
          <div className="flex flex-col items-center justify-center text-center">
            <ItemTitle>{plansData.title}</ItemTitle>
          </div>
        </ItemContent>
      </Item>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plansData.plans.map((plan) => (
          <Item
            key={plan.name}
            variant="outline"
            className={cn(
              'relative flex flex-col gap-6',
              plan.highlighted && 'border-primary ring-2 ring-primary/20',
            )}
          >
            {plan.highlighted ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most popular</Badge>
              </div>
            ) : null}
            <ItemHeader className="flex flex-col gap-2">
              <ItemTitle>
                <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
              </ItemTitle>
              <p className="text-muted-foreground">{plan.description}</p>
            </ItemHeader>
            <ItemContent className="flex flex-col gap-6">
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>{plan.price}</ItemTitle>
                  <ItemDescription>{plan.period}</ItemDescription>
                </ItemContent>
              </Item>
              <div className="flex flex-col gap-2">
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
              </div>
            </ItemContent>
            <ItemFooter>
              <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                {plan.cta}
              </Button>
            </ItemFooter>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
