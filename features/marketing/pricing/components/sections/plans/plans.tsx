import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H2, H3, P } from '@/components/ui/typography'
import { Check } from 'lucide-react'
import { plansData } from './plans.data'

export function Plans() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <H2 className="text-center text-3xl font-bold">{plansData.title}</H2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plansData.plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.highlighted ? 'border-primary ring-2 ring-primary/20' : ''}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <CardHeader className="space-y-2">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <H3 className="text-3xl font-semibold">
                    {plan.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </H3>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 text-primary" />
                      <P className="text-sm">{feature}</P>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
