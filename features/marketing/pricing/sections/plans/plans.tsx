import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
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
      <Item className="items-center justify-center text-center" variant="muted">
        <ItemContent>
          <ItemTitle>{plansData.title}</ItemTitle>
        </ItemContent>
      </Item>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plansData.plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'relative',
              plan.highlighted && 'border-primary ring-2 ring-primary/20',
            )}
          >
            {plan.highlighted ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most popular</Badge>
              </div>
            ) : null}
            <CardHeader className="space-y-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
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
              <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </MarketingSection>
  )
}
