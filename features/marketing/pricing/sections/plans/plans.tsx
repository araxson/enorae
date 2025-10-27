import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Check } from 'lucide-react'
import { plansData } from './plans.data'

export function Plans() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <ItemGroup className="gap-10">
          <Item className="items-center justify-center text-center" variant="muted">
            <ItemContent>
              <h2 className="scroll-m-20">{plansData.title}</h2>
            </ItemContent>
          </Item>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plansData.plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.highlighted ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most popular</Badge>
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroup className="gap-6">
                    <Item variant="muted">
                      <ItemContent>
                        <ItemTitle>{plan.price}</ItemTitle>
                        <ItemDescription>{plan.period}</ItemDescription>
                      </ItemContent>
                    </Item>
                    <ItemGroup className="gap-2">
                      {plan.features.map((feature) => (
                        <Item key={feature} variant="muted">
                          <ItemMedia variant="icon">
                            <Check className="size-4" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>{feature}</ItemDescription>
                          </ItemContent>
                        </Item>
                      ))}
                    </ItemGroup>
                    <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </ItemGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        </ItemGroup>
      </div>
    </section>
  )
}
