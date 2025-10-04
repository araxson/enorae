import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H2, H3, P } from '@/components/ui/typography'
import { Check } from 'lucide-react'
import { plansData } from './plans.data'

export function Plans() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <H2 className="text-center">{plansData.title}</H2>

        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {plansData.plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? 'border-primary shadow-lg' : ''}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <Stack gap="xs" className="pt-4">
                  <H3 className="text-3xl">
                    {plan.price}
                    <span className="text-sm font-normal">{plan.period}</span>
                  </H3>
                </Stack>
              </CardHeader>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="sm">
                    {plan.features.map((feature) => (
                      <Stack key={feature} gap="sm" className="flex-row items-start">
                        <Check className="h-5 w-5 shrink-0 mt-0.5" />
                        <P>{feature}</P>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
