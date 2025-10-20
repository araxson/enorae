import { Section, Stack, Grid } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { teamData } from './team.data'

export function Team() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="md" className="max-w-3xl mx-auto text-center">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{teamData.title}</h2>
          <p className="leading-7 text-lg">{teamData.description}</p>
        </Stack>

        <Grid cols={{ base: 2, md: 4 }} gap="lg">
          {teamData.stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <Stack gap="xs" className="text-center py-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
