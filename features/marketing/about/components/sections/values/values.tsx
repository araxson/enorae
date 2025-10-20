import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart, Lightbulb, Eye, Shield } from 'lucide-react'
import { valuesData } from './values.data'

const iconMap = {
  heart: Heart,
  lightbulb: Lightbulb,
  eye: Eye,
  shield: Shield,
} as const

export function Values() {
  return (
    <Section size="lg" className="bg-muted/30">
      <Stack gap="xl">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">{valuesData.title}</h2>

        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          {valuesData.values.map((value) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap]
            return (
              <Card key={value.title}>
                <CardHeader>
                  <Icon className="h-8 w-8 mb-2" />
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Stack>
    </Section>
  )
}
