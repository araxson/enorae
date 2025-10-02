import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { H2, Lead } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { forBusinessesData } from './for-businesses.data'

export function ForBusinesses() {
  return (
    <Section size="lg" className="bg-muted/30">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <H2>{forBusinessesData.title}</H2>
          <Lead>{forBusinessesData.subtitle}</Lead>
        </Stack>

        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {forBusinessesData.steps.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <Badge variant="secondary" className="mb-2">{`Step ${step.step}`}</Badge>
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
