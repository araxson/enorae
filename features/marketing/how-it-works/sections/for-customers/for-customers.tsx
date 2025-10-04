import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { H2, Lead } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { forCustomersData } from './for-customers.data'

export function ForCustomers() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <H2>{forCustomersData.title}</H2>
          <Lead>{forCustomersData.subtitle}</Lead>
        </Stack>

        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {forCustomersData.steps.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <Badge className="mb-2">{`Step ${step.step}`}</Badge>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
